<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '../../../stores/auth';
import { useTicketStore } from '../../../stores/dataTickets';
import { useRouter } from 'vue-router';

const router = useRouter();
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
const showMessage = (severity, summary) => {
    loading.value = false;
    toast.add({ severity, summary, life: 3000 });
};

onMounted(async () => {
    await ticketStore.getCategory();
    await ticketStore.getPriority();
    selectButtonpriority.value = ticketStore.priority;
    category.value = ticketStore.category;
});
const validateForm = () => {
    if (!dataTicket.priorityId || !dataTicket.subject || !dataTicket.categoryId || !dataTicket.description) {
        showMessage('error', 'Por favor, complete todos los campos.');
        return false;
    }
    return true;
};

const newticket = async () => {
    if (!validateForm()) {
        return;
    }

    dataTicket.userId = authStore.user.user.userId;
    try {
        await ticketStore.addTicket(dataTicket);
        showMessage('success', 'Ticket Generado');
        setTimeout(() => router.push('/newticket/phototicket'), 2000);
    } catch (error) {
        console.log(error);
    }
};
</script>

<template>
    <div class="grid p-fluid mt-3">
        <div class="field col-12 md:col-12">
            <h6>Prioridad</h6>
            <SelectButton v-model="dataTicket.priorityId" :options="selectButtonpriority" optionLabel="name" optionValue="priorityId" />
        </div>
        <div class="field col-12 md:col-6">
            <span class="p-float-label">
                <InputText type="text" id="subject" v-model="dataTicket.subject" />
                <label for="subject">Asunto</label>
            </span>
        </div>
        <div class="field col-12 md:col-6">
            <span class="p-float-label">
                <Dropdown id="dropdown" :options="category" v-model="dataTicket.categoryId" optionLabel="name" optionValue="categoryId"></Dropdown>
                <label for="dropdown">Categoría</label>
            </span>
        </div>

        <div class="field col-12 md:col-12">
            <span class="p-float-label">
                <Textarea inputId="textarea" rows="3" cols="30" v-model="dataTicket.description"></Textarea>
                <label for="textarea">Descripción</label>
            </span>
        </div>
        <div class="field col-12 md:col-4">
            <Toast />
            <Button label="Generar Nuevo Ticket" icon="pi pi-plus" class="p-button-success col-12 md:col-3 mt-4 mr-2 mb-2" :loading="loading" @click="newticket"></Button>
        </div>
    </div>
</template>
