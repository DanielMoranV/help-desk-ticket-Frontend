<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useTicketStore } from '../../stores/dataTickets';
import { useAuthStore } from '../../stores/auth';
import { dformat } from '../../utils/day';
import { io } from 'socket.io-client';
import { backendURL } from '@/config.js';

const socket = io.connect(backendURL, { forceNew: true });
const images = ref();
const responsiveOptions = ref([
    {
        breakpoint: '1500px',
        numVisible: 5
    },
    {
        breakpoint: '1024px',
        numVisible: 3
    },
    {
        breakpoint: '768px',
        numVisible: 2
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
]);
const displayPhoto = ref(false);

const toast = useToast();
const urlPhoto = `${backendURL}/api/v1/photosBilling/`;

const ticketStore = useTicketStore();
const authStore = useAuthStore();

const dataTickets = ref(null);
const dataTicket = ref({});
const deleteDataTicketDialog = ref(false);
const dt = ref(null);
const filters = ref({});
const statusDialog = ref(false);

onBeforeMount(() => {
    initFilters();
});
onMounted(async () => {
    // Escucha el evento 'newTicket' para agregar nuevos tickets a dataTickets
    socket.on('newTicketBilling', (users) => {
        dataTickets.value = users;
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Se añadio un nuevo ticket', life: 3000 });
    });

    // Escucha el evento 'updateTicket' para actualizar tickets en dataTickets
    socket.on('updateTicketBilling', (users) => {
        dataTickets.value = users;
    });
    await ticketStore.getTicketsBilling().then((data) => {
        dataTickets.value = data.map((dataTicket) => {
            return dataTicket;
        });
    });
});

const confirmDeleteUserTicket = (editDataTicket) => {
    dataTicket.value = editDataTicket;
    deleteDataTicketDialog.value = true;
};
const viewTicket = (imgTicket) => {
    images.value = imgTicket.TicketPhotoBilling;

    if (images.value.length > 0) {
        displayPhoto.value = true;
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se registraron imagenes', life: 3000 });
    }
};
const hideDialog = () => {
    statusDialog.value = false;
};
const statusTicket = (statusTicket) => {
    dataTicket.value = { ...statusTicket };
    statusDialog.value = true;
};
const saveTicket = async () => {
    const ticketIndex = dataTickets.value.findIndex((item) => item.ticketBillingId === dataTicket.value.ticketBillingId);
    if (ticketIndex !== -1) {
        await ticketStore.updateTicketsBilling(dataTicket.value.ticketBillingId, dataTicket.value.status, authStore.user.user.userId);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Estado Actualizado', life: 3000 });
        dataTicket.value.resolvedAt = new Date();
        dataTickets.value[ticketIndex] = dataTicket.value;
        statusDialog.value = false;
        dataTicket.value[ticketIndex] = dataTicket.value;
    }
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
                            <h5 class="m-0">Tickets Generados</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                            </span>
                        </div>
                    </template>
                    <Column field="ticketBillingId" header="Nº" :sortable="true" headerStyle="width:10%; min-width:2rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Nº</span>
                            {{ slotProps.data.ticketBillingId }}
                        </template>
                    </Column>
                    <Column field="admission" header="Admisión" :sortable="true" headerStyle="width:10%; min-width:2rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Nº</span>
                            {{ slotProps.data.admission }}
                        </template>
                    </Column>
                    <Column field="categoryBilling.nameBilling" header="Categoría" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Categoría</span>
                            {{ slotProps.data.categoryBilling.nameBilling }}
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
                            {{ dformat(slotProps.data.createdAt, 'DD MMMM YYYY hh:mm a') }}
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
                            {{ slotProps.data.resolvedAt ? dformat(slotProps.data.resolvedAt, 'DD MMMM YYYY hh:mm a') : '- -' }}
                        </template>
                    </Column>
                    <Column field="agent.user.name" header="Resuelto Por:" :sortable="true" headerStyle="width:15%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Resuelto Por:</span>
                            {{ slotProps.data.agent ? slotProps.data.agent.user.name : '- -' }}
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-eye" class="p-button-rounded p-button-success mr-2" @click="viewTicket(slotProps.data)" />
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-info mr-2" @click="statusTicket(slotProps.data)" />
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

                <Galleria v-model:visible="displayPhoto" :value="images" :responsiveOptions="responsiveOptions" :numVisible="9" containerStyle="max-width: 50%" :circular="true" :fullScreen="true" :showItemNavigators="true" :showThumbnails="false">
                    <template #item="slotProps">
                        <img :src="urlPhoto + slotProps.item.filename" :alt="slotProps.item.alt" style="width: 100%; display: block" />
                    </template>
                    <template #thumbnail="slotProps">
                        <img :src="urlPhoto + slotProps.item.filename" :alt="slotProps.item.alt" style="display: block" />
                    </template>
                </Galleria>
                <Dialog v-model:visible="statusDialog" :style="{ width: '450px' }" header="Estado del Ticket" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="name">Nombre</label>
                        <InputText id="name" v-model.trim="dataTicket.user.name" autofocus :disabled="true" />
                    </div>
                    <div class="field">
                        <label for="s">Asunto</label>
                        <InputText id="subject" v-model.trim="dataTicket.subject" autofocus :disabled="true" />
                    </div>
                    <div class="field">
                        <label class="mb-3">Estado Actual</label>
                        <div class="formgrid grid">
                            <div class="field-radiobutton col-4">
                                <RadioButton id="Pendiente" name="option" value="Pendiente" v-model="dataTicket.status" />
                                <label for="Pendiente">Pendiente</label>
                            </div>
                            <div class="field-radiobutton col-4">
                                <RadioButton id="Espera" name="option" value="Espera" v-model="dataTicket.status" />
                                <label for="Espera">Espera</label>
                            </div>
                            <div class="field-radiobutton col-4">
                                <RadioButton id="Aprobado" name="option" value="Aprobado" v-model="dataTicket.status" />
                                <label for="Solucionado">Aprobado</label>
                            </div>
                        </div>
                    </div>
                    <template #footer>
                        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveTicket" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
@import '@/assets/styles/badges.scss';
</style>
