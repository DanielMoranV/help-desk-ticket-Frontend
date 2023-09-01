<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '../../../stores/auth';
import { useTicketStore } from '../../../stores/dataTickets';
import { dformat } from '../../../utils/day';

const authStore = useAuthStore();
const ticketStore = useTicketStore();

const loading = ref(false);
const toast = useToast();
const selectButtonpriority = ref([]);
const category = ref([]);

const dataTicket = reactive({
    priorityId: '',
    subject: '',
    categoryId: '',
    description: ''
});
console.log(ticketStore.dataTicket);

onMounted(async () => {
    // Formatear Fecha y hora
    const createdAt = dformat(ticketStore.dataTicket.createdAt, 'DD MMMM YYYY hh:mm a');
    ticketStore.dataTicket.createdAt = createdAt;
});
</script>

<template>
    <div class="col-12 mt-8 mb-5 p-2 md:p-5" style="border-radius: 20px; background: linear-gradient(0deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #efe1af 0%, #c3dcfa 100%)">
        <div class="flex flex-column justify-content-center align-items-center text-center px-3 py-3 md:py-0">
            <h4 class="text-gray-900 mb-2">!Ticket Generado con Exito¡</h4>
            <span class="text-gray-600 text-2xl">Nº Ticket: {{ ticketStore.dataTicket.ticketId }}</span>
            <p class="text-gray-900 sm:line-height-2 md:line-height-4 text-xl mt-4" style="max-width: 800px"></p>
            <p>Solicitante: {{ ticketStore.dataTicket.userId }}</p>
            <p>Prioridad: {{ ticketStore.dataTicket.priorityId }}</p>
            <p>Categoría: {{ ticketStore.dataTicket.categoryId }}</p>
            <p>Asunto: {{ ticketStore.dataTicket.subject }}</p>
            <p>Descripción: {{ ticketStore.dataTicket.description }}</p>
            <p>Estado: {{ ticketStore.dataTicket.status }}</p>
            <p>Fecha de creación: {{ ticketStore.dataTicket.createdAt }}</p>
        </div>
    </div>
</template>
