<template>
  <div class="p-6 animate-fadeIn">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Lista de tiendas</h1>
      <p class="text-gray-600">Gestiona todas tus tiendas desde aquí</p>
    </div>

    <!-- Stores Grid -->
    <div v-if="stores.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="(store, index) in stores"
        :key="store.id"
        class="
          bg-white rounded-lg shadow-md hover:shadow-xl
          transition-all duration-300 overflow-hidden
          animate-fadeInUp
        "
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <!-- Store Banner/Header -->
        <div
          v-if="store.bannerUrl"
          class="h-32 bg-gradient-to-r from-orange-400 to-orange-600 bg-cover bg-center"
          :style="{ backgroundImage: `url(${store.bannerUrl})` }"
        ></div>
        <div
          v-else
          class="h-32 bg-gradient-to-r from-orange-400 to-orange-600"
        ></div>

        <!-- Store Content -->
        <div class="p-5">
          <!-- Store Logo/Icon -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div
                v-if="store.logoUrl"
                class="
                  w-16 h-16 rounded-full bg-white shadow-md
                  border-2 border-orange-500 overflow-hidden
                  flex items-center justify-center
                "
              >
                <img :src="store.logoUrl" :alt="store.name" class="w-full h-full object-cover" />
              </div>
              <div
                v-else
                class="
                  w-16 h-16 rounded-full bg-orange-500 shadow-md
                  flex items-center justify-center
                "
              >
                <i class="fas fa-store text-white text-2xl"></i>
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-800">{{ store.name }}</h2>
                <p v-if="store.slug" class="text-sm text-gray-500">@{{ store.slug }}</p>
              </div>
            </div>
          </div>

          <!-- Store Description -->
          <p
            v-if="store.description"
            class="text-gray-600 text-sm mb-4 line-clamp-2"
          >
            {{ store.description }}
          </p>

          <!-- Store Info -->
          <div class="space-y-2 mb-4">
            <div class="flex items-center text-sm text-gray-600">
              <i class="fas fa-tag w-5 text-orange-500"></i>
              <span class="ml-2">{{ store.storeType || 'Sin tipo' }}</span>
            </div>
            <div v-if="store.totalSales > 0" class="flex items-center text-sm text-gray-600">
              <i class="fas fa-chart-line w-5 text-green-500"></i>
              <span class="ml-2">{{ store.totalSales }} ventas</span>
            </div>
            <div v-if="store.reputationScore > 0" class="flex items-center text-sm text-gray-600">
              <i class="fas fa-star w-5 text-yellow-500"></i>
              <span class="ml-2">Puntuación: {{ store.reputationScore }}</span>
            </div>
          </div>

          <!-- Status Badges -->
          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-if="store.isVerified"
              class="
                px-3 py-1 bg-green-100 text-green-800
                text-xs font-semibold rounded-full
                flex items-center
              "
            >
              <i class="fas fa-check-circle mr-1"></i>
              Verificado
            </span>
            <span
              :class="[
                'px-3 py-1 text-xs font-semibold rounded-full flex items-center',
                store.isActive
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              ]"
            >
              <i
                :class="[
                  store.isActive ? 'fas fa-check-circle' : 'fas fa-times-circle',
                  'mr-1'
                ]"
              ></i>
              {{ store.isActive ? 'Activo' : 'Inactivo' }}
            </span>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end space-x-2 pt-4 border-t border-gray-200">
            <router-link
              :to="`/app/projects/edit/${store.id}`"
              class="
                bg-orange-500 hover:bg-orange-600
                text-white
                px-4 py-2
                rounded-lg
                transition-all duration-200
                flex items-center space-x-2
                shadow-md hover:shadow-lg
                transform hover:scale-105
              "
              title="Editar tienda"
            >
              <i class="fas fa-edit"></i>
              <span class="hidden sm:inline">Editar</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="flex flex-col items-center justify-center py-16 px-4 animate-fadeIn"
    >
      <div class="bg-gray-100 rounded-full p-8 mb-4">
        <i class="fas fa-store text-gray-400 text-6xl"></i>
      </div>
      <h3 class="text-2xl font-bold text-gray-700 mb-2">No hay tiendas</h3>
      <p class="text-gray-500 text-center mb-6 max-w-md">
        Aún no has creado ninguna tienda. Comienza agregando tu primera tienda.
      </p>
      <router-link
        to="/app/projects/add"
        class="
          bg-orange-500 hover:bg-orange-600
          text-white
          font-semibold
          px-6 py-3
          rounded-lg
          transition-all duration-200
          flex items-center space-x-2
          shadow-md hover:shadow-lg
          transform hover:scale-105
        "
      >
        <i class="fas fa-plus"></i>
        <span>Agregar primera tienda</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useStore } from 'vuex';

import { StoreI } from '@/store/projects/state';

const store = useStore();

const stores = computed<StoreI[]>(() => store.getters['projects/stores']);

onMounted(() => {
  store.dispatch('projects/getStores');
});

</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-in;
}

.animate-fadeInUp {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
