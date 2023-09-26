<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import { useTicketStore } from '../../stores/dataTickets';
import { dformat } from '../../utils/day';
import { useAuthStore } from '../../stores/auth';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const authStore = useAuthStore();
const ticketStore = useTicketStore();
const dataTickets = ref(null);
const dataTicket = ref({});
const filters = ref(null);
const loading = ref(null);
const deleteUserDialog = ref(false);

const confirmDeleteUser = (editUser) => {
    dataTicket.value = editUser;
    deleteUserDialog.value = true;
};

const deleteUserTicket = async () => {
    console.log(dataTicket.value.status);
    if (dataTicket.value.status == 'Pendiente') {
        console.log('soy pendiente');
    }
    dataTickets.value = dataTickets.value.filter((val) => val.ticketId !== dataTicket.value.ticketId);
    await ticketStore.deleteTicket(dataTicket.value.ticketId);
    deleteUserDialog.value = false;
    dataTicket.value = {};
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Ticket eliminado', life: 3000 });
};

onMounted(async () => {
    await ticketStore.getUserTicket(authStore.user.userId).then((data) => {
        dataTickets.value = data.map((dataTicket) => {
            return dataTicket;
        });
        loading.value = false;
    });

    //initFilters();
});
</script>

<template>
    <div class="card card-w-title">
        <h5>Seguimiento de Tickets de Mesa de Ayuda</h5>
        <p>Detalle su inconveniente.</p>
    </div>
    <div class="card">
        <DataTable
            :value="dataTickets"
            :paginator="true"
            class="p-datatable-gridlines"
            :rows="10"
            dataKey="ticketId"
            :rowHover="true"
            v-model:filters="filters"
            filterDisplay="menu"
            :loading="loading"
            :filters="filters"
            responsiveLayout="scroll"
            :globalFilterFields="['ticketId', 'country.name', 'representative.name', 'balance', 'status']"
        >
            <template #header>
                <div class="flex justify-content-between flex-column sm:flex-row">
                    <Button type="button" icon="pi pi-filter-slash" label="Limpiar" class="p-button-outlined mb-2" @click="clearFilter()" />
                    <span class="p-input-icon-left mb-2">
                        <i class="pi pi-search" />
                        <!-- <InputText v-model="filters['global'].value" placeholder="Buscar..." style="width: 100%" /> -->
                    </span>
                </div>
            </template>
            <template #empty> No se encontraron Tickets. </template>
            <template #loading>Cargando datos de tickets. Espere por favor.</template>
            <Column field="ticketId" header="Nº" style="min-width: 5rem">
                <template #body="{ data }">
                    {{ data.ticketId }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Buscar por Nº" />
                </template>
            </Column>
            <Column field="category.name" header="Categoría" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.category.name }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Buscar por Nº" />
                </template>
            </Column>
            <Column field="priority.name" header="Prioridad" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.priority.name }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Buscar por Nº" />
                </template>
            </Column>
            <Column field="description" header="Descripción" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.description }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Buscar por Nº" />
                </template>
            </Column>
            <Column header="Fecha Creación" filterField="date" dataType="date" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ dformat(data.createdAt, 'DD MMMM YYYY') }}
                </template>
                <template #filter="{ filterModel }">
                    <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                </template>
            </Column>
            <Column field="status" header="Estado" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.status }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Buscar por Nº" />
                </template>
            </Column>
            <Column field="resolvedAt" header="Fecha Resolución" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.resolvedAt }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Buscar por Nº" />
                </template>
            </Column>
            <Column header="Acciones">
                <template #body="{ data }">
                    <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteUser(data)" />
                </template>
            </Column>
            <Dialog v-model:visible="deleteUserDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
                <div class="flex align-items-center justify-content-center">
                    <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                    <span v-if="dataTicket"
                        >¿Estás seguro de que quieres eliminar ticket Nº: <b>{{ dataTicket.ticketId }}</b
                        >?</span
                    >
                </div>
                <template #footer>
                    <Toast />
                    <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteUserDialog = false" />
                    <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteUserTicket" />
                </template>
            </Dialog>
        </DataTable>
    </div>
</template>
