<template>
  dashboard
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

import { ProjectI } from '@/store/auth/state';

const store = useStore();
const router = useRouter();

const projects = computed<ProjectI[]>(() => store.getters['auth/projects']);

async function checkProjects() {
  await store.dispatch('auth/getUserProjects');
  if (projects.value.length === 0) {
    router.push('/app/projects');
    return;
  }

  console.log('projects', projects.value);
}

onMounted(() => {
  checkProjects();
});

</script>
