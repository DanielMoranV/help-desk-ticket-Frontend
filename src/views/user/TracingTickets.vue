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

const socket = io.connect(backendURL, { forceNew: true });

const toast = useToast();
const router = useRouter();

const authStore = useAuthStore();
const ticketStore = useTicketStore();
const dataTickets = ref(null);
const dataTicket = ref({});
const deleteDataTicketDialog = ref(false);
const deleteDataTicketsDialog = ref(false);
const dt = ref(null);
const filters = ref({});

onBeforeMount(() => {
    initFilters();
});
onMounted(async () => {
    socket.on('newTicket', (users) => {
        dataTickets.value = users;
    });
    socket.on('updateTicket', (users) => {
        dataTickets.value = users;
    });
    await ticketStore.getUserTicket(authStore.user.userId).then((data) => {
        dataTickets.value = data.map((dataTicket) => {
            return dataTicket;
        });
    });
});

const openNew = () => {
    router.push('/newticket');
};

const confirmDeleteUserTicket = (editDataTicket) => {
    dataTicket.value = editDataTicket;
    deleteDataTicketDialog.value = true;
};

const deleteDataTicket = async () => {
    if (dataTicket.value.status == 'Pendiente') {
        dataTickets.value = dataTickets.value.filter((val) => val.ticketId !== dataTicket.value.ticketId);
        await ticketStore.deleteTicket(dataTicket.value.ticketId);
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
                    dataKey="ticketId"
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
                            <h5 class="m-0">Tickets Generados</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                            </span>
                        </div>
                    </template>
                    <Column field="ticketId" header="Nº" :sortable="true" headerStyle="width:10%; min-width:2rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Nº</span>
                            {{ slotProps.data.ticketId }}
                        </template>
                    </Column>
                    <Column field="category.name" header="Categoría" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Categoría</span>
                            {{ slotProps.data.category.name }}
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
                    <!-- 
                    <Column header="Image" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Image</span>
                            <img :src="'demo/images/dataTicket/' + slotProps.data.image" :alt="slotProps.data.image" class="shadow-2" width="100" />
                        </template>
                    </Column>
                    <Column field="price" header="Price" :sortable="true" headerStyle="width:14%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Price</span>
                            {{ formatCurrency(slotProps.data.price) }}
                        </template>
                    </Column>

                    <Column field="rating" header="Reviews" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Rating</span>
                            <Rating :modelValue="slotProps.data.rating" :readonly="true" :cancel="false" />
                        </template>
                    </Column>

                     -->
                </DataTable>
                <Dialog v-model:visible="deleteDataTicketDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="dataTicket"
                            >Estás seguro de que quieres eliminar ticket Nº <b>{{ dataTicket.ticketId }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDataTicketDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteDataTicket" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteDataTicketsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="dataTicket">Are you sure you want to delete the selected Tickets?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDataTicketsDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedDataTickets" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
@import '@/assets/styles/badges.scss';
</style>
