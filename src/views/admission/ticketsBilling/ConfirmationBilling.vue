<script setup>
import { ref, onMounted } from 'vue';
import { useTicketStore } from '../../../stores/dataTickets';
import { dformat } from '../../../utils/day';
import { useRouter } from 'vue-router';

const router = useRouter();

const ticketStore = useTicketStore();

const loading = ref(false);

const dataTicket = ref([]);
const nextClick = () => {
    router.push('/tracingticketsBilling');
};

onMounted(async () => {
    dataTicket.value = await ticketStore.getTicketBilling(ticketStore.dataTicketBilling.ticketBillingId);
    // Formatear Fecha y hora
    const createdAt = dformat(ticketStore.dataTicketBilling.createdAt, 'DD MMMM YYYY hh:mm a');
    ticketStore.dataTicketBilling.createdAt = createdAt;
});
</script>

<template>
    <div class="grid justify-content-center mt-4">
        <div class="col-12 md:col-12 lg:col-5 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
            <div style="padding: 5px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(172, 180, 223, 0.2))">
                <div class="p-3 surface-card h-full" style="border-radius: 8px">
                    <div class="flex align-items-center justify-content-center bg-cyan-200 mb-3" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                        <i class="fa-solid fa-notes-medical text-2xl text-cyan-700"></i>
                    </div>
                    <h5 class="mb-2 text-900">Nº Ticket Facturación: {{ ticketStore.dataTicketBilling.ticketBillingId }}</h5>
                    <p><b>Solicitante:</b> {{ dataTicket.user ? ticketStore.dataTicketBilling.user.name : 'N/A' }}</p>
                    <p><b>Prioridad:</b> {{ dataTicket.priority ? ticketStore.dataTicketBilling.priority.name : 'N/A' }}</p>
                    <p><b>Categoría:</b> {{ dataTicket.categoryBilling ? ticketStore.dataTicketBilling.categoryBilling.nameBilling : 'N/A' }}</p>
                    <p><b>Estado Póliza:</b> {{ dataTicket.insuredStatus ? ticketStore.dataTicketBilling.insuredStatus : 'N/A' }}</p>
                    <p><b>Admisión:</b> {{ dataTicket.admission ? ticketStore.dataTicketBilling.admission : 'N/A' }}</p>
                    <p><b>Asunto:</b> {{ dataTicket.subject }}</p>
                    <p><b>Descripción:</b> {{ dataTicket.description }}</p>
                    <p><b>Estado:</b> {{ dataTicket.status }}</p>
                    <p><b>Fecha de creación:</b> {{ dataTicket.createdAt }}</p>
                    <Button label="Seguimiento" icon="pi pi-chart-line" class="p-button-success col-12" :loading="loading" @click="nextClick"></Button>
                </div>
            </div>
        </div>
    </div>
</template>
