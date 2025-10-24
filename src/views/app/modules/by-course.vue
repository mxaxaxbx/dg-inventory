<template>
  <div class="bg-white p-4">
    <router-link
      :to="`/app/courses/${course.title}-${course.id}`"
      class="text-lg font-semibold mb-4 text-orange-500"
    >
      {{ course.title }}
    </router-link>
    <!-- line -->
    <div class="bg-gray-200 h-0.5 w-full my-4"></div>
    <!-- add module link -->
    <router-link
      v-validate-perm
      data-perm="modules/add"
      :to="`/app/modules/add/${course.id}`"
      class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mb-10"
    >
      Add Module
    </router-link>
    <!-- modules -->
    <div v-if="modules.length > 0" class="grid grid-cols-1 gap-4 mt-4">
      <div
        v-for="m in modules"
        :key="m.id"
        class="
          flex flex-col space-y-2
          p-4
          bg-gray-100
          rounded-lg
          hover:bg-gray-200
          transition
          duration-300
        "
      >
        <router-link
          :to="`/app/modules/content/${m.title}-${m.id}`"
          class="text-lg font-semibold text-orange-500"
        >
          {{ m.title }}
        </router-link>
        <!-- line -->
        <div class="bg-gray-200 h-0.5 w-full"></div>
        <p class="text-sm text-gray-500">{{ m.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import { CourseI } from '@/store/courses/state';
import { ModuleI } from '@/store/modules/state';

const store = useStore();
const route = useRoute();
const router = useRouter();

const course = computed<CourseI>(() => store.state.courses.course);
const modules = computed<ModuleI[]>(() => store.state.modules.modules);

const loading = ref(false);

function setTitle() {
  document.title = `${course.value.title} - digi-edu`;
}

async function getModules() {
  loading.value = true;
  try {
    const courseId = route.params.courseId as string;
    await store.dispatch('modules/getbycourse', courseId);
  } catch (error: any) {
    console.error(error);
    const msg = error.response.data.error || 'An error occurred getting modules';
    store.commit('notifications/addNotification', { text: msg, type: 'error' });
  } finally {
    loading.value = false;
  }
}

async function getCourse() {
  loading.value = true;
  try {
    const courseId = route.params.courseId as string;
    await store.dispatch('courses/get', courseId);
    setTitle();
    getModules();
  } catch (error: any) {
    console.error(error);
    const msg = error.response.data.error || 'An error occurred getting course';
    store.commit('notifications/addNotification', { text: msg, type: 'error' });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getCourse();
});

</script>
