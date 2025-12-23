<template>
  dashboard
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

async function checkProjects() {
  console.log('checkProjects');
}

onMounted(() => {
  checkProjects();
});

</script>
