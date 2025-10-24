<template>
  <div class="bg-white p-4">
    <router-link
      :to="`/app/lessons/${m.id}`"
      class="text-lg font-semibold mb-4 text-orange-500"
    >
      {{ m.title }}
    </router-link>
    <!-- line -->
    <div class="bg-gray-200 h-0.5 w-full my-4"></div>
    <editor
      :modelValue="{
        title: lesson.title || 'untitled',
        content: lesson.content,
      }"
      @update:modelValue="value => {
        lesson.title = value.title;
        lesson.content = value.content;
      }"
    />
    <div class="mt-4 flex justify-end">
      <button
        type="button"
        :disabled="loading"
        @click="saveLesson"
        class="
          bg-orange-500
          text-white
          px-4 py-2
          rounded
          hover:bg-orange-600
        "
      >
        <i v-if="loading" class="fas fa-spinner fa-spin"></i>
        Add lesson
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  computed,
  defineAsyncComponent,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import { ModuleI } from '@/store/modules/state';
import { LessonI } from '@/store/lessons/state';

const editor = defineAsyncComponent(() => import('@/components/global/block-editor.vue'));

const store = useStore();
const route = useRoute();
const router = useRouter();

const m = computed<ModuleI>(() => store.state.modules.module);

const loading = ref(false);
const lesson = ref<LessonI>({
  id: 0,
  content: '',
  moduleId: 0,
  order: 0,
  title: '',
  transcript: '',
});

function setTitle() {
  document.title = `Agregar lesión ${m.value.title} - digi-edu`;
}

async function getModule() {
  loading.value = true;
  try {
    const moduleId = route.params.moduleId as string;
    await store.dispatch('modules/get', moduleId);
    lesson.value.moduleId = m.value.id;
    setTitle();
  } catch (error: any) {
    console.error(error);
    const msg = error.response.data.error || 'An error occurred getting the module';
    store.commit('notifications/addNotification', { text: msg, type: 'error' });
  } finally {
    loading.value = false;
  }
}

async function saveLesson() {
  loading.value = true;
  try {
    await store.dispatch('lessons/add', lesson.value);
    router.push({ path: `/app/lessons/${m.value.id}` });
  } catch (error: any) {
    const msg = error.response.data.error || 'An error occurred saving the lesson';
    store.commit('notifications/addNotification', { type: 'error', message: msg });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getModule();
});

</script>
