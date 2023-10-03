<script setup>
import { ref } from 'vue';

const nestedRouteItems = ref([
    {
        label: 'Nuevo Ticket',
        to: '/newticketBilling'
    },
    {
        label: 'Foto',
        to: '/newticketBilling/phototicketBilling'
    },
    {
        label: 'Confirmacíon',
        to: '/newticketBilling/confirmationBilling'
    }
]);
</script>

<template>
    <div class="card card-w-title">
        <h5>Registro Tickets Facturación</h5>
        <p>Registra tu ticket, detalla el asunto y añade una o varias fotos</p>
        <Steps :model="nestedRouteItems" :readonly="true" />
        <router-view />
    </div>
</template>
