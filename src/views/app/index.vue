<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { StoreI } from '@/store/projects/state';

const store = useStore();
const route = useRoute();
const router = useRouter();

const project = computed<StoreI>(() => store.getters['projects/store']);

function checkURLQueryProject() {
  const projectQuery = typeof route.query.project === 'string' ? route.query.project : '';
  if (projectQuery === '') {
    router.push({ query: { project: project.value.id } });
  }

  const projectQueryNumber = Number(projectQuery);

  if (projectQueryNumber !== project.value.id) {
    store.dispatch('projects/changeStore', projectQueryNumber);
  }
}

onMounted(() => {
  const isAuth = store.getters['auth/isAuth'];
  if (!isAuth) {
    store.dispatch('auth/logout');
  }
  checkURLQueryProject();
});
</script>
