<script setup>
import { ref, onBeforeMount, computed, onMounted } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useTariffStore } from '../../stores/dataTariff';

const tariffStore = useTariffStore();
const { layoutConfig } = useLayout();

import { FilterMatchMode, FilterOperator } from 'primevue/api';

const filters = ref(null);
const loading = ref(null);

const filtersMedico = ref(null);
const loadingMedico = ref(null);

const tariffGeneral = ref(null);
const tariffPersonalizado = ref(null);

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});
onBeforeMount(async () => {
    initFilters();
    initFiltersMedico();
});

onMounted(async () => {
    await tariffStore.getTariffGeneral().then((data) => (tariffGeneral.value = data));
    await tariffStore.getTariffPersonalizado().then((data) => (tariffPersonalizado.value = data));
});

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        cod_seg: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        nom_seg: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        ts_seg: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};
const initFiltersMedico = () => {
    filtersMedico.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        codigoSegus: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        nombre: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        medico: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        costo: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};

// const expandAll = () => {
//     expandedRows.value = products.value.reduce((acc, p) => (acc[p.id] = true) && acc, {});
// };
// const collapseAll = () => {
//     expandedRows.value = null;
// };
const formatCurrency = (value) => {
    return value.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });
};
</script>

<template>
    <div class="surface-0 flex justify-content-center">
        <div id="home" class="landing-wrapper overflow-hidden">
            <div class="py-4 px-4 mx-0 md:mx-6 lg:mx-8 lg:px-8 flex align-items-center justify-content-between relative lg:static mb-3">
                <a class="flex align-items-center" href="#"> <img :src="logoUrl" alt="Clínica Santa Rosa Logo" height="60" class="mr-0 lg:mr-2" /></a>
                <a class="cursor-pointer block lg:hidden text-700 p-ripple" v-ripple v-styleclass="{ selector: '@next', enterClass: 'hidden', leaveToClass: 'hidden', hideOnOutsideClick: true }">
                    <i class="pi pi-bars text-4xl"></i>
                </a>
                <div class="align-items-center surface-0 flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full left-0 px-6 lg:px-0 z-2" style="top: 120px">
                    <ul class="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row cursor-pointer">
                        <li>
                            <router-link to="/">
                                <a class="flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3 p-ripple" v-ripple>
                                    <span>Inicio</span>
                                </a>
                            </router-link>
                        </li>

                        <li>
                            <router-link to="/tariff">
                                <a class="flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3 p-ripple" v-ripple>
                                    <span>Tarifas</span>
                                </a>
                            </router-link>
                        </li>
                    </ul>
                    <!-- <div class="flex justify-content-between lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
                        <router-link to="/auth/login"><Button label="Mesa de Ayuda" class="p-button-rounded border-none ml-5 font-light text-white line-height-2 bg-blue-500"></Button></router-link>
                    </div> -->
                </div>
            </div>
            <div id="pricing" class="py-4 px-4 lg:px-8 my-2 md:my-4">
                <div class="text-center">
                    <h2 class="text-900 font-normal mb-2">Tarifario se servicios Clinicos</h2>
                </div>

                <div class="grid justify-content-between mt-8 md:mt-0">
                    <div class="col-12 lg:col-12 p-0 md:p-3">
                        <TabView>
                            <TabPanel header="Tarifario General">
                                <DataTable :value="tariffGeneral" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading" :filters="filters" showGridlines :globalFilterFields="['cod_seg', 'nom_seg', 'ts_seg', 'grp_seg']">
                                    <template #header>
                                        <div class="flex justify-content-between flex-column sm:flex-row">
                                            <!-- <Button icon="pi pi-plus" label="Expand All" @click="expandAll" />
                            <Button icon="pi pi-minus" label="Collapse All" @click="collapseAll" /> -->
                                            <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                                        </div>
                                    </template>
                                    <template #empty> No hay registros que mostrar </template>
                                    <template #loading>Cargando tarifario porfavor espere </template>
                                    <!-- <Column :expander="true" headerStyle="width: 3rem" /> -->
                                    <Column field="cod_seg" header="Codigo Segus" :sortable="true">
                                        <template #body="slotProps">
                                            {{ slotProps.data.cod_seg }}
                                        </template>
                                    </Column>
                                    <Column field="nom_seg" header="Nombre Procedimiento" :sortable="true">
                                        <template #body="slotProps">
                                            {{ slotProps.data.nom_seg }}
                                        </template>
                                    </Column>
                                    <Column field="grp_seg" header="Categoría" :sortable="true">
                                        <template #body="slotProps">
                                            {{ slotProps.data.grp_seg }}
                                        </template>
                                    </Column>
                                    <Column field="ts_seg" header="Costo" :sortable="true">
                                        <template #body="slotProps">
                                            {{ formatCurrency(Number(slotProps.data.ts_seg)) }}
                                        </template>
                                    </Column>

                                    <!-- <template #expansion="slotProps">
                                <div v-if="slotProps.data.personalized_tariff && slotProps.data.personalized_tariff.length > 0" class="p-3">
                                    <h5>Personalizado {{ slotProps.data.nombre }}</h5>
                                    <DataTable :value="slotProps.data.personalized_tariff">
                                        <Column field="medico" header="Médico" :sortable="true">
                                            <template #body="slotProps">
                                                {{ slotProps.data.medico }}
                                            </template>
                                        </Column>
                                        <Column field="costoPersonalizado" header="Costo Personalizado" :sortable="true">
                                            <template #body="slotProps">
                                                {{ formatCurrency(slotProps.data.costoPersonalizado) }}
                                            </template>
                                        </Column>
                                    </DataTable>
                                </div>
                            </template> -->
                                </DataTable>
                            </TabPanel>
                            <TabPanel header="Tarifario Médico">
                                <DataTable
                                    :value="tariffPersonalizado"
                                    :paginator="true"
                                    :rows="10"
                                    dataKey="id"
                                    :rowHover="true"
                                    :loading="loadingMedico"
                                    :filters="filtersMedico"
                                    showGridlines
                                    :globalFilterFields="['tarifario_general.cod_seg', 'medico.nom_ser', 'imp_seg', 'tarifario_general.nom_seg']"
                                >
                                    <template #header>
                                        <div class="flex justify-content-between flex-column sm:flex-row">
                                            <InputText v-model="filtersMedico['global'].value" placeholder="Buscar..." />
                                        </div>
                                    </template>
                                    <template #empty> No hay registros que mostrar </template>
                                    <template #loading>Cargando tarifario porfavor espere </template>
                                    <Column field="tarifario_general.cod_seg" header="Codigo Segus" :sortable="true">
                                        <template #body="slotProps">
                                            {{ slotProps.data.tarifario_general.cod_seg }}
                                        </template>
                                    </Column>
                                    <Column field="tarifario_general.nom_seg" header="Nombre Procedimiento" :sortable="true">
                                        <template #body="slotProps">
                                            {{ slotProps.data.tarifario_general.nom_seg }}
                                        </template>
                                    </Column>
                                    <Column field="medico.nom_ser" header="Médico" :sortable="true">
                                        <template #body="slotProps">
                                            {{ slotProps.data.medico.nom_ser }}
                                        </template>
                                    </Column>
                                    <!-- <Column field="general_tariff.grp_seg" header="Categoría" :sortable="true">
                                        <template #body="slotProps">
                                            {{ slotProps.data.general_tariff.grp_seg }}
                                        </template>
                                    </Column> -->
                                    <Column field="imp_seg" header="Costo" :sortable="true">
                                        <template #body="slotProps">
                                            {{ formatCurrency(Number(slotProps.data.imp_seg)) }}
                                        </template>
                                    </Column>
                                </DataTable>
                            </TabPanel>
                        </TabView>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>
