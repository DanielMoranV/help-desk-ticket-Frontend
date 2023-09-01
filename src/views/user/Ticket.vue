<script setup>
import { ref } from 'vue';

const nestedRouteItems = ref([
    {
        label: 'Nuevo Ticket',
        to: '/newticket'
    },
    {
        label: 'Foto',
        to: '/newticket/phototicket'
    },
    {
        label: 'Confirmacíon',
        to: '/newticket/confirmation'
    }
]);
</script>

<template>
    <div class="card card-w-title">
        <h5>Registro Tickets de Mesa de Ayuda</h5>
        <p>Registra tu ticket de ayuda, detalla el incoveniente y añade una o varias fotos</p>
        <Steps :model="nestedRouteItems" :readonly="true" />
        <router-view />
    </div>
</template>
