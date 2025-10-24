<template>
  <div class="bg-white p-4">
    <router-link
      :to="`/app/modules/${m.id}`"
      class="text-lg font-semibold mb-4 text-orange-500"
    >
      {{ m.title }}
    </router-link>
    <!-- line -->
    <div class="bg-gray-200 h-0.5 w-full my-4"></div>
    <!-- add lesson and exam -->
    <div class="flex items-center space-x-4">
      <router-link
        v-validate-perm
        data-perm="lessons/add"
        :to="`/app/lessons/add/${m.id}`"
        class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
      >
        Add lesson
      </router-link>
      <router-link
        v-validate-perm
        data-perm="quizzes/add"
        :to="`/app/quizzes/add/${m.id}`"
        class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
      >
        Add Quizz
      </router-link>
    </div>
    <!-- modules -->
    <div v-if="lessons.length > 0" class="grid grid-cols-1 gap-4 mt-4">
      <div
        v-for="l in lessons"
        :key="l.id"
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
          :to="`/app/lessons/content/${l.title}-${l.id}`"
          class="text-lg font-semibold text-orange-500"
        >
          {{ l.title }}
        </router-link>
        <!-- line -->
        <div class="bg-gray-200 h-0.5 w-full"></div>
        <p class="text-sm text-gray-500">
          {{ truncateHTML(l.content, 100) }}
        </p>
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
import { LessonI } from '@/store/lessons/state';

const store = useStore();
const route = useRoute();
const router = useRouter();

const m = computed<ModuleI>(() => store.state.modules.module);
const lessons = computed<LessonI[]>(() => store.state.lessons.lessons);

const loading = ref(false);

function truncateHTML(html: string, maxLength: number) {
  const div = document.createElement('div');
  div.innerHTML = html;
  const textContent = div.textContent || div.innerText || '';
  return textContent.length > maxLength
    ? `${textContent.substring(0, maxLength)}...`
    : textContent;
}

function setTitle() {
  document.title = `${m.value.title} - digi-edu`;
}

async function getLessons() {
  loading.value = true;
  try {
    const moduleId = route.params.moduleId as string;
    await store.dispatch('lessons/getbymodule', moduleId);
  } catch (error: any) {
    console.error(error);
    const msg = error.response.data.error || 'An error occurred getting modules';
    store.commit('notifications/addNotification', { text: msg, type: 'error' });
  } finally {
    loading.value = false;
  }
}

async function getModule() {
  loading.value = true;
  try {
    const moduleId = route.params.moduleId as string;
    await store.dispatch('modules/get', moduleId);
    setTitle();
    getLessons();
  } catch (error: any) {
    console.error(error);
    const msg = error.response.data.error || 'An error occurred getting module';
    store.commit('notifications/addNotification', { text: msg, type: 'error' });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getModule();
});

</script>
