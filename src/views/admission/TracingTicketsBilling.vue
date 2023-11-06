<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { useTicketStore } from '../../stores/dataTickets';
import { dformat } from '../../utils/day';
import { useAuthStore } from '../../stores/auth';
import { io } from 'socket.io-client';
import { backendURL } from '@/config.js';

const toast = useToast();
const router = useRouter();

const authStore = useAuthStore();
const ticketStore = useTicketStore();
const dataTickets = ref(null);
const dataTicket = ref({});
const deleteDataTicketDialog = ref(false);
const dt = ref(null);
const filters = ref({});

const socket = io.connect(backendURL, { forceNew: true });

onBeforeMount(() => {
    initFilters();
});
onMounted(async () => {
    socket.on('newTicketBilling', (users) => {
        dataTickets.value = users;
    });
    socket.on('updateTicketBilling', (users) => {
        dataTickets.value = users;
    });
    await ticketStore.getUserTicketBilling(authStore.user.userId).then((data) => {
        dataTickets.value = data.map((dataTicket) => {
            return dataTicket;
        });
    });
});

const openNew = () => {
    router.push('/newticketBilling');
};

const confirmDeleteUserTicket = (editDataTicket) => {
    dataTicket.value = editDataTicket;
    deleteDataTicketDialog.value = true;
};

const deleteDataTicket = async () => {
    if (dataTicket.value.status == 'Pendiente') {
        dataTickets.value = dataTickets.value.filter((val) => val.ticketBillingId !== dataTicket.value.ticketBillingId);
        await ticketStore.deleteTicketBilling(dataTicket.value.ticketBillingId);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Ticket Eliminado', life: 3000 });
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Ticket Atendido no se puede eliminar', life: 3000 });
    }
    deleteDataTicketDialog.value = false;
    dataTicket.value = {};
};

const exportCSV = () => {
    dt.value.exportCSV();
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Nuevo Ticket" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <Button label="Exportar" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="dataTickets"
                    dataKey="ticketBillingId"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Mostrando del  {first} al {last} de {totalRecords} Tickets"
                    responsiveLayout="scroll"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Tickets de Facturación Generados</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                            </span>
                        </div>
                    </template>
                    <Column field="ticketId" header="Nº" :sortable="true" headerStyle="width:10%; min-width:2rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Nº</span>
                            {{ slotProps.data.ticketBillingId }}
                        </template>
                    </Column>
                    <Column field="admission" header="Admisión" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Admisión</span>
                            {{ slotProps.data.admission }}
                        </template>
                    </Column>
                    <Column field="categoryBilling.nameBilling" header="Categoría" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Categoría</span>
                            {{ slotProps.data.categoryBilling.nameBilling }}
                        </template>
                    </Column>
                    <Column field="insuredStatus" header="Estado Póliza" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Estado Póliza</span>
                            {{ slotProps.data.insuredStatus }}
                        </template>
                    </Column>
                    <Column field="priority.name" header="Prioridad" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Category</span>
                            {{ slotProps.data.priority.name }}
                        </template>
                    </Column>
                    <Column field="description" header="Descripción" :sortable="true" headerStyle="width:15%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Descripción</span>
                            {{ slotProps.data.description }}
                        </template>
                    </Column>
                    <Column field="createdAt" header="F. Creación" :sortable="true" headerStyle="width:15%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Descripción</span>
                            {{ dformat(slotProps.data.createdAt, 'DD MMMM YYYY') }}
                        </template>
                    </Column>
                    <Column field="status" header="Estado" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Estado</span>
                            <span :class="'dataTicket-badge status-' + (slotProps.data.status ? slotProps.data.status.toLowerCase() : '')">{{ slotProps.data.status }}</span>
                        </template>
                    </Column>
                    <Column field="resolvedAt" header="F. Resolución" :sortable="true" headerStyle="width:15%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">F. Resolución</span>
                            {{ slotProps.data.resolvedAt ? dformat(slotProps.data.resolvedAt, 'DD MMMM YYYY') : '- -' }}
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteUserTicket(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
                <Dialog v-model:visible="deleteDataTicketDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="dataTicket"
                            >Estás seguro de que quieres eliminar ticket Nº <b>{{ dataTicket.ticketBillingId }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDataTicketDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteDataTicket" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
@import '@/assets/styles/badges.scss';
</style>
