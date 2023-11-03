<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useDataauthStore } from '../../stores/dataUser';
import { dformat } from '../../utils/day';
//import { saveAs } from 'file-saver';
//import * as XLSX from 'xlsx';

const toast = useToast();
const dataUserStore = useDataauthStore();

const users = ref(null);
const user = ref({});
const userDialog = ref(false);
const deleteUserDialog = ref(false);
const deleteUsersDialog = ref(false);
const selectedUsers = ref(null);
const selectedPositionValue = ref({
    name: null,
    positionId: null
});
const positionValue = ref(null);
const positionFilteredValue = ref([]);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

onBeforeMount(() => {
    initFilters();
});
const filename = `listUsers-${dformat(new Date(), 'DD-MM-YYYY')}`;
onMounted(async () => {
    await dataUserStore.getUsers().then((data) => {
        users.value = data.map((user) => {
            return user;
        });
    });
    await dataUserStore.getPosition().then((data) => {
        positionValue.value = data;
    });
});

const openNew = () => {
    user.value = {
        accessId: null,
        active: null,
        username: null,
        createAt: null,
        lastSession: null,
        password: null,
        status: null,
        positionId: null,
        position: {
            name: null,
            positionId: null
        },
        user: {
            dni: null,
            email: null,
            name: null,
            phone: null,
            photo: null,
            userId: null
        }
    };
    selectedPositionValue.value = null;
    submitted.value = false;
    userDialog.value = true;
};

const hideDialog = () => {
    userDialog.value = false;
    submitted.value = false;
};

const validateRequiredFields = () => {
    const userValue = user.value.user;
    return userValue.name && userValue.name.trim() && userValue.dni;
};

const updateUser = async () => {
    const payload = {
        username: user.value.user.dni,
        password: user.value.user.dni,
        positionId: selectedPositionValue.value.positionId,
        user: {
            dni: user.value.user.dni,
            email: user.value.user.email,
            name: user.value.user.name,
            photo: user.value.user.photo,
            phone: user.value.user.phone
        }
    };
    user.value.position.positionId = selectedPositionValue.value.positionId;
    user.value.position.name = selectedPositionValue.value.name;
    if (user.value.accessId) {
        const userIndex = users.value.findIndex((item) => item.accessId === user.value.accessId);
        if (userIndex !== -1) {
            payload.accessId = user.value.accessId;
            payload.user.userId = user.value.user.userId;
            await dataUserStore.updateUser(payload.username, payload);
            console.log(user.value);
            users.value[userIndex] = user.value;
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Colaborador Actualizado', life: 3000 });
        }
    } else {
        const dataUser = await dataUserStore.createUser(payload);
        user.value.accessId = dataUser.accessId;
        user.value.status = 'offline';
        users.value.push(user.value);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Colaborador Registrado', life: 3000 });
    }

    userDialog.value = false;
    user.value = {};
};

const saveUser = async () => {
    submitted.value = true;

    if (validateRequiredFields()) {
        updateUser();
    }
};

const editUser = (editUser) => {
    user.value = { ...editUser };
    selectedPositionValue.value.name = user.value.position.name;
    selectedPositionValue.value.positionId = user.value.position.positionId;

    userDialog.value = true;
};

// const confirmDeleteUser = (editUser) => {
//     user.value = editUser;
//     deleteUserDialog.value = true;
// };

const deleteUser = async () => {
    users.value = users.value.filter((val) => val.accessId !== user.value.accessId);
    await dataUserStore.disableUser(user.value.accessId);
    deleteUserDialog.value = false;
    user.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
};

const exportCSV = () => {
    console.log(dt.value);
    dt.value.exportCSV();
};
// const exportToExcel = () => {
//     // Obtén los datos de la tabla
//     const data = dt.value.value.map((row) => ({ ...row }));

//     // Crea una hoja de cálculo a partir de los datos
//     const worksheet = XLSX.utils.json_to_sheet(data);

//     // Crea un libro de trabajo y añade la hoja de cálculo
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

//     // Escribe el libro de trabajo a un archivo Excel
//     const excelData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

//     // Guarda el archivo en el sistema del cliente
//     saveAs(new Blob([excelData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `${filename}.xlsx`);
// };

// const onUpload = (event) => {
//     const file = event.files[0];
//     const reader = new FileReader();

//     reader.onload = (e) => {
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: 'array' });

//         const worksheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[worksheetName];

//         const jsonData = XLSX.utils.sheet_to_json(worksheet);

//         // Ahora jsonData contiene los datos del archivo Excel en formato JSON
//         console.log(jsonData);
//     };

//     reader.readAsArrayBuffer(file);
// };

// const confirmDeleteSelected = () => {
//     deleteUsersDialog.value = true;
// };
const deleteSelectedUsers = () => {
    users.value = users.value.filter((val) => !selectedUsers.value.includes(val));
    const selectedIds = selectedUsers.value.map((user) => user.accessId);

    selectedIds.forEach(async (accessId) => {
        await dataUserStore.disableUser(accessId);
    });
    deleteUsersDialog.value = false;
    selectedUsers.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Colaboradores deshabilitados', life: 3000 });
};
const searchPosition = (event) => {
    if (!event.query.trim().length) {
        positionFilteredValue.value = [...positionValue.value];
    } else {
        positionFilteredValue.value = positionValue.value.filter((position) => {
            return position.name.toLowerCase().startsWith(event.query.toLowerCase());
        });
    }
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
                            <Button label="Nuevo" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            <!-- <Button label="Deshabilitar" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedUsers || !selectedUsers.length" /> -->
                        </div>
                    </template>

                    <template v-slot:end>
                        <!-- <FileUpload
                            mode="basic"
                            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            :auto="true"
                            :maxFileSize="1000000"
                            label="Importar"
                            chooseLabel="Importar"
                            class="mr-2 inline-block"
                            @upload="onUpload"
                        /> -->
                        <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="users"
                    v-model:selection="selectedUsers"
                    dataKey="accessId"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Colaboradores"
                    responsiveLayout="scroll"
                    :exportFilename="filename"
                    :rowHover="true"
                    showGridlines
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Gestión de usuarios</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                            </span>
                        </div>
                    </template>

                    <!-- <Column selectionMode="multiple" headerStyle="width: 3rem"></Column> -->
                    <Column field="user.dni" header="DNI" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">DNI</span>
                            {{ slotProps.data.user.dni }}
                        </template>
                    </Column>
                    <Column field="user.name" header="Nombre y Apellidos" :sortable="true" headerStyle="width:20%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Nombre y Apellidos</span>
                            {{ slotProps.data.user.name }}
                        </template>
                    </Column>
                    <Column field="user.email" header="Email" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Email</span>
                            {{ slotProps.data.user.email }}
                        </template>
                    </Column>
                    <Column field="position.name" header="Rol" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Rol</span>
                            {{ slotProps.data.position.name }}
                        </template>
                    </Column>
                    <Column field="status" header="Status" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <span :class="'user-badge status-' + (slotProps.data.status ? slotProps.data.status.toLowerCase() : '')">{{ slotProps.data.status }}</span>
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;" header="Acciones">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editUser(slotProps.data)" />
                            <!-- <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteUser(slotProps.data)" /> -->
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="userDialog" :style="{ width: '500px' }" header="Detalle de colaborador" :modal="true" class="p-fluid">
                    <!-- <img :src="contextPath + 'demo/images/user/' + user.image" :alt="user.image" v-if="user.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" /> -->
                    <div class="field">
                        <label for="dni">DNI</label>
                        <InputText id="name" v-model.trim="user.user.dni" required="true" autofocus :class="{ 'p-invalid': submitted && !user.user.dni }" />
                        <small class="p-invalid" v-if="submitted && !user.user.dni">DNI es requerido.</small>
                    </div>
                    <div class="field">
                        <label for="name">Nombre</label>
                        <InputText id="name" v-model.trim="user.user.name" required="true" autofocus :class="{ 'p-invalid': submitted && !user.user.name }" />
                        <small class="p-invalid" v-if="submitted && !user.user.name">Nombre es requerido.</small>
                    </div>
                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="phone">Teléfono</label>
                            <InputText id="name" v-model.trim="user.user.phone" />
                        </div>
                    </div>
                    <div class="field">
                        <label for="name">Email</label>
                        <InputText id="name" v-model.trim="user.user.email" required="true" autofocus :class="{ 'p-invalid': submitted && !user.user.email }" />
                        <small class="p-invalid" v-if="submitted && !user.user.name">Nombre es requerido.</small>
                    </div>
                    <div class="field">
                        <label for="name">Rol</label>
                        <AutoComplete placeholder="Buscar..." id="dd" :dropdown="true" v-model="selectedPositionValue" :optionLabel="user.position.name" :suggestions="positionFilteredValue" @complete="searchPosition($event)" field="name" />
                    </div>

                    <template #footer>
                        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveUser" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteUserDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="user"
                            >¿Estás seguro de que quieres eliminar <b>{{ user.user.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteUserDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteUser" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteUsersDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="user">¿Está seguro de que desea eliminar los usuarios seleccionados?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteUsersDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedUsers" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/badges.scss';
</style>
