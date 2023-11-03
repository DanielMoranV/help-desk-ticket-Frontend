<script setup>
import { ref, onMounted, watch } from 'vue';
import AppMenuItem from './AppMenuItem.vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

const defaultMenuModel = [
    {
        label: 'Personal',
        items: [
            { label: 'Registarse', icon: 'pi pi-fw pi-user', to: '/signin', roles: ['Invitado'] },
            { label: 'Perfil', icon: 'pi pi-fw pi-user', to: '/profile', roles: [11, 4, 1, 6, 'Colaborador'] }
        ]
    },
    {
        label: 'Administración',
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard', roles: [4, 11] },
            { label: 'Usuarios', icon: 'pi pi-fw pi-users', to: '/users', roles: [4, 11] }
        ]
    },
    {
        label: 'Ticket Seguros',
        items: [
            { label: 'Nueva Solicitud', icon: 'pi pi-fw pi-money-bill', to: '/newticketBilling', roles: [4, 1, 2] },
            { label: 'Seguimiento', icon: 'pi pi-fw pi-chart-bar', to: '/tracingticketsBilling', roles: [4, 1, 2] },
            { label: 'Tickets', icon: 'pi pi-fw pi-ticket', to: '/ticketsBilling', roles: [11, 4, 6] }
        ]
    },
    {
        label: 'Help Desk Tickets',
        items: [
            { label: 'Nuevo', icon: 'pi pi-fw pi-plus', to: '/newticket', roles: [4, 1, 6, 'Colaborador'] },
            { label: 'Seguimiento', icon: 'pi pi-fw pi-chart-line', to: '/tracingtickets', roles: [4, 1, 6, 'Colaborador'] },
            { label: 'Tickets', icon: 'pi pi-fw pi-ticket', to: '/tickets', roles: [11, 4] }
        ]
    }
];

const model = ref([]);

function updateMenuModel() {
    const userRole = authStore.sessionUser ? authStore.area : 'Invitado';
    model.value = defaultMenuModel
        .map((section) => ({
            ...section,
            items: section.items.filter((item) => item.roles.includes(userRole))
        }))
        .filter((section) => section.items.length > 0);
}

onMounted(async () => {
    await authStore.currentUser();
    updateMenuModel();
});

watch(
    () => authStore.sessionUser,
    async (newSession) => {
        model.value = defaultMenuModel;
        if (newSession) {
            await authStore.currentUser();
            updateMenuModel();
        }
    }
);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
