<script setup>
import { onMounted, ref } from 'vue';
import { useTicketStore } from '../../stores/dataTickets';

const ticketStore = useTicketStore();
const dataTickets = ref(null);
const dataTicketsBilling = ref(null);
onMounted(async () => {
    dataTickets.value = await ticketStore.countStatusTicket();
    dataTicketsBilling.value = await ticketStore.countStatusTicketBilling();
});
</script>

<template>
    <div class="grid">
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Tickets Soporte T.I</span>
                        <div class="text-900 font-medium text-xl">{{ dataTickets ? dataTickets.Total : 0 }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-ticket text-blue-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium"> {{ dataTickets ? dataTickets.Resuelto : 0 }}</span>
                <span class="text-500"> Resueltos</span><br />
                <span class="text-yellow-500 font-medium"> {{ dataTickets ? dataTickets.Espera : 0 }} </span>
                <span class="text-500"> En Espera</span><br />
                <span class="text-red-500 font-medium"> {{ dataTickets ? dataTickets.Pendiente : 0 }}</span>
                <span class="text-500"> Pendientes</span>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Solicitudes Facturación</span>
                        <div class="text-900 font-medium text-xl">{{ dataTicketsBilling ? dataTicketsBilling.Total : 0 }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-wallet text-blue-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium"> {{ dataTicketsBilling ? dataTicketsBilling.Aprobado : 0 }}</span>
                <span class="text-500"> Resueltos</span><br />
                <span class="text-yellow-500 font-medium"> {{ dataTicketsBilling ? dataTicketsBilling.Espera : 0 }} </span>
                <span class="text-500"> En Espera</span><br />
                <span class="text-red-500 font-medium"> {{ dataTicketsBilling ? dataTicketsBilling.Pendiente : 0 }}</span>
                <span class="text-500"> Pendientes</span>
            </div>
        </div>
    </div>
</template>
