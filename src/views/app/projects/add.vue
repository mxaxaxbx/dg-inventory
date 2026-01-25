<template>
  <div class="bg-white p-4">
    <h1 class="text-2xl font-bold"> Agregar comercio </h1>
    <!-- line -->
    <div class="bg-gray-200 h-0.5 w-full my-4"></div>
    <form @submit.prevent="submit">
      <div class="grid grid-cols-1 gap-4">
        <div>
          <label for="name" class="text-sm font-semibold"> Nombre del comercio </label>
          <input
            type="text"
            id="name"
            v-model="project.name"
            class="w-full border border-gray-300 rounded p-2"
            required
            :class="{ 'border-red-500': error }"
          />
          <p v-if="error" class="text-red-500 text-sm mt-1">
            {{ error }}
          </p>
        </div>
        <!-- submit button -->
        <div class="flex justify-end">
          <button
            type="submit"
            class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            :class="{ 'cursor-not-allowed opacity-50': loading }"
            :disabled="loading"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            Agregar comercio
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

import { ProjectI } from '@/store/projects/state';

const store = useStore();
const route = useRoute();

const project = computed<ProjectI>(() => store.state.projects.project);

const loading = ref(false);
const error = ref('');

async function submit() {
  loading.value = true;
  try {
    await store.dispatch('projects/addProject', project.value);
    const reference = typeof route.query.ref === 'string' ? route.query.ref : '';
    if (reference === 'auth') {
      const token = localStorage.getItem('token');
      window.location.href = `/auth/confirmsession?token=${token}`;
    } else {
      window.location.href = '/app/projects';
    }
  } catch (err: any) {
    console.error(err);
    const msg = err.response?.data?.error || 'An error occurred saving the project';
    store.commit('notifications/addNotification', { type: 'error', message: msg });
  } finally {
    loading.value = false;
  }
}
</script>
