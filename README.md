# CSR Vue — Help Desk Ticket Frontend

Aplicación web para la gestión de tickets de soporte (mesa de ayuda) y tickets de facturación, con paneles diferenciados para usuarios, personal de soporte/admisión y administradores. Construida sobre el template administrativo **Sakai** de PrimeVue.

## Sobre este proyecto

Lo construí en 2023 **por iniciativa propia**, a título personal, para mejorar los procesos de soporte de la clínica donde trabajo. **Nunca llegó a usarse allí**: fue uno de mis primeros proyectos completos y su objetivo real era demostrar —a otros y a mí mismo— que podía llevar una idea hasta una aplicación funcional de punta a punta. Después de este vino `csr_seguros`, ya como encargo formal.

**Estado: archivado, fuera de servicio.** No hay despliegue activo. El flujo principal (autenticación, creación y seguimiento de tickets de soporte y de facturación, panel de administración de usuarios) está implementado; las tareas pendientes se documentan en [Problemas conocidos](#problemas-conocidos-y-deuda-técnica) y ya no se van a abordar.

El backend que consumía esta SPA está en un repositorio privado.

## Tabla de contenidos

- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Módulos y rutas](#módulos-y-rutas)
- [Puesta en marcha](#puesta-en-marcha)
- [Variables de entorno](#variables-de-entorno)
- [Scripts disponibles](#scripts-disponibles)
- [Seguridad](#seguridad)
- [Problemas conocidos y deuda técnica](#problemas-conocidos-y-deuda-técnica)
- [Licencia](#licencia)

## Tecnologías

| Categoría         | Tecnología                                            |
| ------------------ | ------------------------------------------------------ |
| Framework           | [Vue 3](https://vuejs.org/) (Composition API + `<script setup>`) |
| Build tool          | [Vite 4](https://vitejs.dev/)                          |
| UI Kit              | [PrimeVue 3.28](https://primevue.org/) (tema Sakai) + PrimeIcons + PrimeFlex |
| Estado global        | [Pinia](https://pinia.vuejs.org/)                       |
| Enrutamiento         | [Vue Router 4](https://router.vuejs.org/) (hash history) |
| Cliente HTTP         | [Axios](https://axios-http.com/) (instancia centralizada con interceptores) |
| Tiempo real          | [Socket.io Client](https://socket.io/)                  |
| Gráficos             | [Chart.js 3](https://www.chartjs.org/)                  |
| Fechas               | [Day.js](https://day.js.org/)                           |
| Estilos              | SCSS                                                    |
| Calidad de código    | ESLint + Prettier                                       |

## Arquitectura

La aplicación sigue una arquitectura **SPA por capas**, típica de Vue 3 + Pinia:

```
┌─────────────────────────────────────────────────────────┐
│  Views (src/views)                                       │
│  Pantallas por dominio: auth, user, admin, admission,     │
│  billing, support, public, pages                          │
└───────────────┬─────────────────────────────────────────┘
                │ usa
┌───────────────▼─────────────────────────────────────────┐
│  Stores (Pinia) — src/stores                              │
│  Estado de sesión/autenticación (auth.js)                 │
└───────────────┬─────────────────────────────────────────┘
                │ llama
┌───────────────▼─────────────────────────────────────────┐
│  API layer — src/api                                      │
│  index.js: funciones por endpoint (tickets, usuarios,     │
│  facturación, tarifas, accesos)                            │
│  axios.js: instancia Axios con interceptores de request    │
│  (Authorization) y response (normalización de errores)     │
└───────────────┬─────────────────────────────────────────┘
                │ HTTP
┌───────────────▼─────────────────────────────────────────┐
│  Backend API (VITE_API_URL)                                │
└─────────────────────────────────────────────────────────┘
```

Piezas transversales:

- **Router (`src/router`)**: define las rutas y un guard global `beforeEach` que valida `meta.requiresAuth` y `meta.roles` contra el estado del store `auth`.
- **Layout (`src/layout`)**: shell de la aplicación (topbar, sidebar, menú, footer) reutilizado por todas las vistas autenticadas vía `AppLayout.vue`.
- **Cache local (`src/utils/cache.js`)**: envoltorio sobre `localStorage` que serializa el usuario/token con codificación Base64.
- **Composables (`src/composables`)**: lógica reutilizable (p. ej. `useResponse` para notificaciones tipo toast).
- **Services (`src/service`)**: mocks/datos de ejemplo heredados del template Sakai (`CountryService`, `ProductService`, etc.), usados por las vistas de demostración (`Blocks`, `Documentation`, `Icons`).

## Estructura del proyecto

```
src/
├── api/            # Cliente Axios + funciones de endpoints
├── assets/         # Estilos globales, temas PrimeVue, media
├── components/      # Componentes compartidos (BlockViewer, CodeHighlight)
├── composables/     # Lógica reutilizable (toasts, etc.)
├── layout/          # Shell de la app (topbar, sidebar, menú)
├── router/          # Definición de rutas y guards
├── service/         # Servicios de datos de ejemplo (heredados del template)
├── stores/          # Stores de Pinia (auth)
├── utils/           # Helpers (cache/localStorage, fechas)
└── views/
    ├── admin/        # Dashboard y gestión de usuarios
    ├── admission/     # Flujo de tickets de facturación (admisión)
    ├── billing/       # Bandeja de tickets de facturación
    ├── support/       # Bandeja de tickets de soporte
    ├── user/          # Perfil, creación y seguimiento de tickets del usuario
    ├── public/        # Vistas públicas (registro, tarifario)
    └── pages/          # Auth (login/acceso/error), landing, errores, utilidades
```

## Módulos y rutas

| Módulo              | Rutas principales                                              | Descripción                                             |
| -------------------- | ---------------------------------------------------------------- | --------------------------------------------------------- |
| Autenticación         | `/auth/login`, `/auth/access`, `/auth/error`                      | Inicio de sesión y páginas de error/acceso denegado         |
| Landing / público     | `/`, `/tariff`, `/signin`                                          | Página de aterrizaje, tarifario y registro público          |
| Tickets de soporte    | `/newticket`, `/newticket/phototicket`, `/newticket/confirmation`, `/tracingtickets`, `/tickets` | Creación, adjunto de foto, confirmación y seguimiento de tickets de soporte |
| Tickets de facturación| `/newticketBilling`, `/newticketBilling/phototicketBilling`, `/newticketBilling/confirmationBilling`, `/tracingticketsBilling`, `/ticketsBilling` | Flujo equivalente para tickets de facturación/admisión |
| Administración        | `/dashboard`, `/users`, `/profile`                                  | Panel de indicadores, gestión de usuarios y perfil            |

> Nota: actualmente ninguna ruta define `meta.requiresAuth` ni `meta.roles`, por lo que el guard de autenticación existe en el router pero no se aplica todavía a rutas concretas (ver [Problemas conocidos](#problemas-conocidos-y-deuda-técnica)).

## Puesta en marcha

Requisitos: Node.js 18+ y npm.

```sh
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# editar .env con la URL real del backend

# 3. Levantar entorno de desarrollo
npm run dev
```

## Variables de entorno

| Variable        | Descripción                                    |
| ---------------- | ------------------------------------------------ |
| `VITE_API_URL`   | URL base de la API consumida por el frontend (usada por Axios) |
| `TEST_API_URL`   | URL de API para entorno de pruebas                |
| `API_URL`        | URL de API adicional (uso heredado)               |

Copia `.env.example` a `.env` y ajusta los valores según tu entorno. **El archivo `.env` no debe subirse al repositorio.**

## Scripts disponibles

| Comando           | Descripción                                  |
| ------------------ | ----------------------------------------------- |
| `npm run dev`       | Servidor de desarrollo con hot-reload (`--host`) |
| `npm run build`      | Compila y minifica para producción               |
| `npm run preview`    | Sirve localmente el build de producción           |
| `npm run lint`       | Corre ESLint con `--fix` sobre `.vue/.js/.jsx/.cjs/.mjs` |

## Seguridad

Como parte del mantenimiento de este repositorio se realizó una auditoría de credenciales y configuración sensible. Resultado:

- ✅ No se encontraron contraseñas, API keys ni tokens **hardcodeados** en el código fuente (`src/`). El login se resuelve dinámicamente contra el backend.
- ⚠️ **Corregido**: el archivo `.env` estaba versionado en git desde commits históricos, exponiendo la URL del backend. Se removió del control de versiones, se agregó a `.gitignore` y se creó `.env.example` como plantilla.
- ⚠️ **Corregido**: se eliminó `dist.zip` (build compilado de ~9 MB) que estaba versionado innecesariamente en el repositorio.
- ℹ️ **El historial no se purgó, y es una decisión consciente.** La URL sigue siendo recuperable de los commits antiguos, pero apunta a un servicio que ya no existe, así que no hay nada que rotar. Merece la pena dejar dicho el principio general: en un repositorio público, dejar de rastrear un archivo **no lo elimina del historial** — sigue descargable por URL de commit. Sirve para dejar de sangrar, nunca como contención. Ante un secreto real, la única respuesta válida es repositorio privado más rotación de la credencial.
- ℹ️ El token de sesión se persiste en `localStorage` codificado en Base64 (`src/utils/cache.js`), lo cual **no es cifrado** (es reversible por cualquiera con acceso al navegador/DevTools) y es susceptible a robo vía XSS. Se recomienda evaluar cookies `httpOnly`/`secure` o al menos documentar el riesgo aceptado.
- ℹ️ El guard de rutas (`router/index.js`) valida `meta.requiresAuth`/`meta.roles`, pero ninguna ruta define esos meta campos actualmente, por lo que la protección de rutas depende hoy del backend, no del frontend.

## Problemas conocidos y deuda técnica

- ✅ **Corregido**: tres importaciones dinámicas de `router/index.js` no coincidían en mayúsculas con los archivos reales (`views/Support/`, `views/Billing/`, `views/public/tariff.vue`). Windows y macOS no distinguen mayúsculas y lo toleraban, pero el build reventaba en Linux y CI. Ya apuntan al nombre exacto.
- El guard de autenticación del router no está aplicado a ninguna ruta (`meta.requiresAuth` sin usar).
- `src/service/*` contiene datos de ejemplo heredados del template Sakai (`CountryService`, `ProductService`, `NodeService`), usados solo por vistas de demostración (`Blocks`, `Documentation`, `Icons`) que podrían eliminarse si no forman parte del producto final.
- No hay tests automatizados configurados en el proyecto.

## Licencia

Este proyecto se basa en el template **Sakai** de PrimeTek, distribuido bajo licencia MIT (ver [`LICENSE.md`](./LICENSE.md)).
