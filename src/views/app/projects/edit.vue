<template>
  {{ storeData }}
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

import { StoreI } from '@/store/projects/state';

const store = useStore();
const route = useRoute();

const storeData = ref<StoreI>();
const loading = ref(false);

async function getStore() {
  loading.value = true;
  try {
    storeData.value = await store.dispatch('projects/getStore', Number(route.params.id));
  } catch (error: any) {
    console.error(error);
    const msg = error.response.data.error || 'An error occurred getting the store';
    store.commit('notifications/addNotification', { text: msg, type: 'error' });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getStore();
});

</script>
