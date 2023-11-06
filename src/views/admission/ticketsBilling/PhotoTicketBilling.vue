<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '../../../stores/auth';
import { useTicketStore } from '../../../stores/dataTickets';
import { useRouter } from 'vue-router';
import { backendURL } from '@/config.js';

const router = useRouter();
const ticketStore = useTicketStore();
const authStore = useAuthStore();

// Estado
const loading = ref(false);

// Toast
const toast = useToast();
const showSuccessToast = () => {
    toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Archivos subidos',
        life: 3000
    });
};

// Función de subida
const onUpload = () => {
    showSuccessToast();
    setTimeout(() => router.push('/newticketBilling/confirmationBilling'), 2000);
};

// Antes de la subida
const beforeUpload = (request) => {
    request.xhr.setRequestHeader('Authorization', authStore.user.token);
    return request;
};

// Datos del ticket
const ticketId = ref('');
const baseUrl = ref('');

// Redireccionar a confirmacion
const nextClick = () => {
    router.push('/newticketBilling/confirmationBilling');
};

onMounted(() => {
    // Obtener datos del ticket
    ticketId.value = ticketStore.dataTicketBilling.ticketBillingId;

    // Configurar URL y encabezados

    baseUrl.value = `${backendURL}/api/v1/ticketsBilling/${ticketId.value}/photo`;
});
</script>

<template>
    <div class="field col-12 md:col-12">
        <h5>Fotos</h5>
        <Toast />
        <FileUpload name="ticketBillingPhotos" :url="baseUrl" @upload="onUpload" @before-send="beforeUpload" :multiple="true" accept="image/*" :maxFileSize="10 * 1024 * 1024" fileLimit:5 class="custom-file-upload" />
    </div>
    <div class="field col-12 md:col-12">
        <Toast />
        <Button label="Omitir" icon="pi pi-arrow-right" class="p-button-info col-12 md:col-3 mt-4 mr-2 mb-2" :loading="loading" @click="nextClick"></Button>
    </div>
</template>
<style scoped>
/* Personaliza los estilos de los botones utilizando las clases de PrimeVue */
.custom-file-upload .p-fileupload-buttonbar .p-fileupload-choose,
.custom-file-upload .p-fileupload-buttonbar .p-fileupload-upload {
    background-color: #ff8800; /* Cambia el color de fondo del botón */
    color: white; /* Cambia el color del texto del botón */
    border: none; /* Elimina el borde del botón si lo deseas */
}

.custom-file-upload .p-fileupload-buttonbar .p-fileupload-choose:hover,
.custom-file-upload .p-fileupload-buttonbar .p-fileupload-upload:hover {
    background-color: #00b31b; /* Cambia el color de fondo del botón en estado hover */
}
.p-fileupload-file-remove {
    background-color: #00b31b;
}
</style>
