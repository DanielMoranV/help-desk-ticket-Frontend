import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/dashboard',
            component: AppLayout,
            children: [
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/admin/Dashboard.vue')
                },
                {
                    path: '/users',
                    name: 'users',
                    component: () => import('@/views/admin/Users.vue')
                },
                {
                    path: '/profile',
                    name: 'profile',
                    component: () => import('@/views/user/Profile.vue')
                },
                {
                    path: '/signin',
                    name: 'signin',
                    component: () => import('@/views/public/Signin.vue')
                },

                {
                    path: '/newticket',
                    name: 'newticket',
                    component: () => import('@/views/user/Ticket.vue'),
                    children: [
                        {
                            path: '/newticket',
                            component: () => import('@/views/user/tickets/NewTicket.vue')
                        },
                        {
                            path: '/newticket/phototicket',
                            component: () => import('@/views/user/tickets/PhotoTicket.vue')
                        },
                        {
                            path: '/newticket/confirmation',
                            component: () => import('@/views/user/tickets/Confirmation.vue')
                        }
                    ]
                },
                {
                    path: '/tracingtickets',
                    name: 'tracingtickets',
                    component: () => import('@/views/user/TracingTickets.vue')
                },
                {
                    path: '/tracingticketsBilling',
                    name: 'tracingticketsBilling',
                    component: () => import('@/views/admission/TracingTicketsBilling.vue')
                },
                {
                    path: '/tickets',
                    name: 'tickets',
                    component: () => import('@/views/Support/Tickets.vue')
                },
                {
                    path: '/ticketsBilling',
                    name: 'ticketsBilling',
                    component: () => import('@/views/Billing/TicketsBilling.vue')
                },
                {
                    path: '/newticketBilling',
                    name: 'billing',
                    component: () => import('@/views/admission/Billing.vue'),
                    children: [
                        {
                            path: '/newticketBilling',
                            component: () => import('@/views/admission/ticketsBilling/NewTicketBilling.vue')
                        },
                        {
                            path: '/newticketBilling/phototicketBilling',
                            component: () => import('@/views/admission/ticketsBilling/PhotoTicketBilling.vue')
                        },
                        {
                            path: '/newticketBilling/confirmationBilling',
                            component: () => import('@/views/admission/ticketsBilling/ConfirmationBilling.vue')
                        }
                    ]
                }
            ]
        },
        {
            path: '/',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.sessionUser) {
        // El usuario no está autenticado, redirige a la página de inicio de sesión
        next('/login');
    } else if (to.meta.roles && !authStore.hasRole(to.meta.roles)) {
        // El usuario no tiene el rol requerido para acceder a la ruta
        // Por ejemplo, si la ruta requiere ['administrador', 'medico'] y el usuario es 'admisionista', no tendrá acceso.
        next('/unauthorized');
    } else {
        // El usuario está autenticado y tiene el rol requerido para acceder a la ruta
        next();
    }
});
export default router;
