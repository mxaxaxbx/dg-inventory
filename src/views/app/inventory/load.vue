<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-3xl font-bold text-gray-800 mb-2">
        <i class="fas fa-file-excel text-green-600 mr-2"></i>
        Cargar Inventario
      </h2>
      <p class="text-gray-600">Sube un archivo Excel para cargar el inventario</p>
    </div>

    <!-- Download Format Example -->
    <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <i class="fas fa-info-circle text-blue-600 mr-2"></i>
          <span class="text-blue-800 font-medium">¿Necesitas el formato de ejemplo?</span>
        </div>
        <button
          @click="downloadFormatExample"
          class="
            bg-blue-600
            hover:bg-blue-700
            text-white
            font-semibold
            py-2 px-4
            rounded-lg
            transition-all duration-200
            flex items-center
            animate__animated animate__pulse
          "
        >
          <i class="fas fa-download mr-2"></i>
          Descargar Formato
        </button>
      </div>
    </div>

    <!-- Upload Area -->
    <div
      class="
        border-2 border-dashed
        rounded-lg
        p-12
        text-center
        transition-all duration-300
        cursor-pointer
        relative
        overflow-hidden
      "
      :class="[
        isDragging
          ? 'border-green-500 bg-green-50 scale-105'
          : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100',
        uploadedFile ? 'border-green-500 bg-green-50' : ''
      ]"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
      @keydown.enter="triggerFileInput"
      role="button"
      tabindex="0"
    >
      <!-- Background Animation -->
      <div
        v-if="isDragging"
        class="absolute inset-0 bg-green-200 opacity-20 animate__animated animate__pulse"
      ></div>

      <!-- Upload Content -->
      <div class="relative z-10">
        <div
          v-if="!uploadedFile"
          class="animate__animated animate__fadeIn"
        >
          <i
            class="
              fas fa-cloud-upload-alt
              text-6xl
              mb-4
              transition-colors duration-300
            "
            :class="isDragging ? 'text-green-600' : 'text-gray-400'"
          ></i>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">
            {{ isDragging ? 'Suelta el archivo aquí' : 'Arrastra y suelta tu archivo Excel' }}
          </h3>
          <p class="text-gray-500 mb-4">o</p>
          <label
            for="excel-upload"
            class="
              inline-block
              bg-orange-500
              hover:bg-orange-600
              text-white
              font-semibold
              py-2 px-6
              rounded-lg
              cursor-pointer
              transition-all duration-200
              animate__animated animate__fadeInUp
            "
          >
            <i class="fas fa-folder-open mr-2"></i>
            Seleccionar Archivo
          </label>
          <input
            id="excel-upload"
            ref="fileInput"
            type="file"
            :accept="excelAcceptTypes"
            class="hidden"
            @change="handleFileSelect"
          />
          <p class="text-sm text-gray-400 mt-4">
            Formatos aceptados: .xlsx, .xls
          </p>
        </div>

        <!-- Uploaded File Display -->
        <div
          v-else
          class="animate__animated animate__fadeIn"
        >
          <i class="fas fa-check-circle text-6xl text-green-600 mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">
            Archivo seleccionado
          </h3>
          <div class="bg-white rounded-lg p-4 shadow-md inline-block mb-4">
            <div class="flex items-center">
              <i class="fas fa-file-excel text-green-600 text-2xl mr-3"></i>
              <div class="text-left">
                <p class="font-semibold text-gray-800">{{ uploadedFile.name }}</p>
                <p class="text-sm text-gray-500">
                  {{ formatFileSize(uploadedFile.size) }}
                </p>
              </div>
            </div>
          </div>
          <button
            @click.stop="removeFile"
            class="
              bg-red-500
              hover:bg-red-600
              text-white
              font-semibold
              py-2 px-4
              rounded-lg
              transition-all duration-200
              animate__animated animate__fadeInUp
            "
          >
            <i class="fas fa-times mr-2"></i>
            Eliminar Archivo
          </button>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div
      v-if="errorMessage"
      class="
        mt-4
        p-4
        bg-red-50
        border border-red-200
        rounded-lg
        animate__animated animate__shakeX
      "
    >
      <div class="flex items-center">
        <i class="fas fa-exclamation-circle text-red-600 mr-2"></i>
        <p class="text-red-800 font-medium">{{ errorMessage }}</p>
      </div>
    </div>

    <!-- Upload Button -->
    <div
      v-if="uploadedFile"
      class="mt-6 flex justify-center"
    >
      <button
        @click="handleUpload"
        class="
          bg-green-600
          hover:bg-green-700
          text-white
          font-bold
          py-3 px-8
          rounded-lg
          transition-all duration-200
          flex items-center
          animate__animated animate__fadeInUp
          shadow-lg
          hover:shadow-xl
        "
      >
        <i class="fas fa-upload mr-2"></i>
        Cargar Inventario
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const excelAcceptTypes = computed(() => (
  '.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
));

const fileInput = ref<HTMLInputElement | null>(null);
const uploadedFile = ref<File | null>(null);
const isDragging = ref(false);
const errorMessage = ref('');

function validateAndSetFile(file: File) {
  errorMessage.value = '';

  // Check if file is Excel
  const validExtensions = ['.xlsx', '.xls'];
  const validMimeTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];

  const fileNameParts = file.name.split('.');
  const lastPart = fileNameParts[fileNameParts.length - 1];
  const fileExtension = lastPart ? `.${lastPart.toLowerCase()}` : '';
  const isValidExtension = validExtensions.includes(fileExtension);
  const isValidMimeType = validMimeTypes.includes(file.type);

  if (!isValidExtension && !isValidMimeType) {
    errorMessage.value = 'Por favor, selecciona un archivo Excel (.xlsx o .xls)';
    return;
  }

  uploadedFile.value = file;
}

function triggerFileInput() {
  if (!uploadedFile.value) {
    fileInput.value?.click();
  }
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    validateAndSetFile(target.files[0]);
  }
}

function handleDragOver(event: DragEvent) {
  event.preventDefault();
  isDragging.value = true;
}

function handleDragLeave(event: DragEvent) {
  event.preventDefault();
  isDragging.value = false;
}

function handleDrop(event: DragEvent) {
  event.preventDefault();
  isDragging.value = false;

  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    validateAndSetFile(event.dataTransfer.files[0]);
  }
}

function removeFile() {
  uploadedFile.value = null;
  errorMessage.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = Math.round((bytes / (k ** i)) * 100) / 100;
  return `${size} ${sizes[i]}`;
}

function downloadFormatExample() {
  // Create a simple Excel-like CSV structure as example
  const exampleData = [
    ['Código', 'Nombre', 'Cantidad', 'Precio', 'Categoría'],
    ['INV001', 'Producto Ejemplo 1', '10', '25.50', 'Categoría A'],
    ['INV002', 'Producto Ejemplo 2', '5', '15.75', 'Categoría B'],
    ['INV003', 'Producto Ejemplo 3', '20', '8.99', 'Categoría A'],
  ];

  // Convert to CSV
  const csvContent = exampleData.map((row) => row.join(',')).join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', 'formato_inventario_ejemplo.csv');
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Show message that CSV is provided as example
  // (since we can't create real Excel without a library)
  setTimeout(() => {
    // eslint-disable-next-line no-console
    console.log('Se ha descargado un archivo CSV de ejemplo.');
  }, 100);
}

function handleUpload() {
  if (!uploadedFile.value) {
    return;
  }

  // Just view - no actual upload logic
  // eslint-disable-next-line no-console
  console.log(`Archivo "${uploadedFile.value.name}" listo para cargar.`);
}
</script>
