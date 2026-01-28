<template>
  <div class="p-6 animate__animated animate__fadeIn">
    <!-- Loading Overlay -->
    <div
      v-if="loading && !storeData"
      class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-8 flex flex-col items-center space-y-4">
        <i class="fas fa-spinner fa-spin text-4xl text-orange-500"></i>
        <p class="text-gray-700 font-semibold">Cargando información de la tienda...</p>
      </div>
    </div>

    <!-- Form Container -->
    <div v-else-if="storeData" class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8 animate__animated animate__fadeInDown">
        <div class="flex items-center space-x-3 mb-2">
          <i class="fas fa-store text-3xl text-orange-500"></i>
          <h1 class="text-3xl font-bold text-gray-800">Editar Tienda</h1>
        </div>
        <p class="text-gray-600 ml-11">Modifica la información de tu tienda</p>
      </div>

      <!-- Form -->
      <form
        @submit.prevent="handleSubmit"
        class="bg-white rounded-lg shadow-lg p-6 animate__animated animate__fadeInUp"
      >
        <!-- Basic Information Section -->
        <div class="mb-8">
          <div class="flex items-center space-x-2 mb-4 pb-2 border-b border-gray-200">
            <i class="fas fa-info-circle text-orange-500"></i>
            <h2 class="text-xl font-semibold text-gray-800">Información Básica</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Name -->
            <div>
              <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fas fa-tag mr-2 text-orange-500"></i>Nombre de la Tienda *
              </label>
              <input
                id="name"
                v-model="storeData.name"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg
                  focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                  transition-all duration-200"
                placeholder="Ingresa el nombre de la tienda"
              />
            </div>

            <!-- Slug -->
            <!-- <div>
              <label for="slug" class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fas fa-link mr-2 text-orange-500"></i>Slug *
              </label>
              <input
                id="slug"
                v-model="storeData.slug"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg
                  focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                  transition-all duration-200"
                placeholder="ejemplo-tienda"
              />
            </div> -->

            <!-- Store Type -->
            <div>
              <label for="storeType" class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fas fa-store-alt mr-2 text-orange-500"></i>Tipo de Tienda *
              </label>
              <select
                id="storeType"
                name="storeType"
                v-model="storeData.storeType"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg
                  focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                  transition-all duration-200"
              >
                <option selected disabled value="">Selecciona un tipo</option>
                <option
                  v-for="type in storeType"
                  :key="type"
                  :value="type"
                >
                  {{ type }}
                </option>
              </select>
            </div>

            <!-- Description -->
            <div class="md:col-span-2">
              <label for="description" class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fas fa-align-left mr-2 text-orange-500"></i>Descripción
              </label>
              <textarea
                id="description"
                v-model="storeData.description"
                rows="4"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg
                  focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                  transition-all duration-200 resize-none"
                placeholder="Describe tu tienda..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Media Section -->
        <div class="mb-8">
          <div class="flex items-center space-x-2 mb-4 pb-2 border-b border-gray-200">
            <i class="fas fa-images text-orange-500"></i>
            <h2 class="text-xl font-semibold text-gray-800">Imágenes</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Logo URL -->
            <div>
              <label for="logoUrl" class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fas fa-image mr-2 text-orange-500"></i>URL del Logo
              </label>
              <input
                id="logoUrl"
                v-model="storeData.logoUrl"
                type="url"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg
                  focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                  transition-all duration-200"
                placeholder="https://ejemplo.com/logo.png"
              />
              <div v-if="storeData.logoUrl" class="mt-3">
                <img
                  :src="storeData.logoUrl"
                  alt="Logo preview"
                  class="w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
                  @error="handleImageError"
                />
              </div>
            </div>

            <!-- Banner URL -->
            <div>
              <label for="bannerUrl" class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fas fa-image mr-2 text-orange-500"></i>URL del Banner
              </label>
              <input
                id="bannerUrl"
                v-model="storeData.bannerUrl"
                type="url"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg
                  focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                  transition-all duration-200"
                placeholder="https://ejemplo.com/banner.png"
              />
              <div v-if="storeData.bannerUrl" class="mt-3">
                <img
                  :src="storeData.bannerUrl"
                  alt="Banner preview"
                  class="w-full h-32 rounded-lg object-cover border-2 border-gray-200"
                  @error="handleImageError"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Status Section -->
        <div class="mb-8">
          <!-- <div class="flex items-center space-x-2 mb-4 pb-2 border-b border-gray-200">
            <i class="fas fa-toggle-on text-orange-500"></i>
            <h2 class="text-xl font-semibold text-gray-800">Estado y Configuración</h2>
          </div> -->

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Is Verified -->
            <!-- <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <input
                id="isVerified"
                v-model="storeData.isVerified"
                type="checkbox"
                class="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <label
                for="isVerified"
                class="flex items-center space-x-2 text-sm font-semibold
                  text-gray-700 cursor-pointer"
              >
                <i class="fas fa-check-circle text-green-500"></i>
                <span>Tienda Verificada</span>
              </label>
            </div> -->

            <!-- Is Active -->
            <!-- <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <input
                id="isActive"
                v-model="storeData.isActive"
                type="checkbox"
                class="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <label
                for="isActive"
                class="flex items-center space-x-2 text-sm font-semibold
                  text-gray-700 cursor-pointer"
              >
                <i class="fas fa-power-off text-blue-500"></i>
                <span>Tienda Activa</span>
              </label>
            </div> -->

            <!-- Reputation Score -->
            <!-- <div>
              <label for="reputationScore" class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fas fa-star mr-2 text-orange-500"></i>Puntuación de Reputación
              </label>
              <input
                id="reputationScore"
                v-model.number="storeData.reputationScore"
                type="number"
                min="0"
                max="100"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg
                  focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                  transition-all duration-200"
                placeholder="0"
              />
            </div> -->

            <!-- Total Sales -->
            <!-- <div>
              <label for="totalSales" class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fas fa-dollar-sign mr-2 text-orange-500"></i>Ventas Totales
              </label>
              <input
                id="totalSales"
                v-model.number="storeData.totalSales"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg
                  focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                  transition-all duration-200"
                placeholder="0"
              />
            </div> -->
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="handleCancel"
            class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700
              font-semibold rounded-lg transition-all duration-200 flex items-center
              space-x-2 animate__animated animate__fadeIn"
          >
            <i class="fas fa-times"></i>
            <span>Cancelar</span>
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white
              font-semibold rounded-lg transition-all duration-200 flex items-center
              space-x-2 disabled:opacity-50 disabled:cursor-not-allowed
              animate__animated animate__fadeIn"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-save"></i>
            <span>{{ loading ? 'Guardando...' : 'Guardar Cambios' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';

import { StoreI } from '@/store/projects/state';

const store = useStore();
const route = useRoute();
const router = useRouter();

const storeData = ref<StoreI>();
const loading = ref(false);
const storeType = ref<string[]>(['retail', 'online', 'wholesale', 'service', 'other']);

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.style.display = 'none';
}

async function handleSubmit() {
  if (!storeData.value) return;

  loading.value = true;
  try {
    await store.dispatch('projects/updateStore', storeData.value);
    store.commit('notifications/addNotification', {
      message: 'Tienda actualizada exitosamente',
      type: 'success',
    });
    // Navigate back to list after a short delay
    setTimeout(() => {
      router.push({ name: 'app-projects-list' });
    }, 1000);
  } catch (error: unknown) {
    console.error(error);
    const err = error as { response?: { data?: { error?: string } } };
    const msg = err.response?.data?.error || 'Ocurrió un error al actualizar la tienda';
    store.commit('notifications/addNotification', { message: msg, type: 'error' });
  } finally {
    loading.value = false;
  }
}

function handleCancel() {
  router.push({ name: 'app-projects-list' });
}

async function getStore() {
  loading.value = true;
  try {
    storeData.value = await store.dispatch(
      'projects/getStore',
      Number(route.params.id),
    );
  } catch (error: unknown) {
    console.error(error);
    const err = error as { response?: { data?: { error?: string } } };
    const msg = err.response?.data?.error || 'Ocurrió un error al obtener la tienda';
    store.commit('notifications/addNotification', { message: msg, type: 'error' });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getStore();
});
</script>
