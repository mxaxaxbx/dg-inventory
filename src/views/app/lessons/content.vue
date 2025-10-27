<template>
  <div class="bg-white p-4">
    <router-link
      v-validate-perm
      data-perm="lessons/update"
      :to="`/app/lessons/${lesson.moduleId}`"
      class="text-lg font-semibold mb-4 text-green-500"
    >
      {{ m.title }}
    </router-link>
    <router-link
      v-if="showContent"
      :to="`/app/lessons/${lesson.moduleId}`"
      class="text-lg font-semibold mb-4 text-green-500"
    >
      {{ lesson.title }}
    </router-link>
    <!-- line -->
    <div class="bg-gray-200 h-0.5 w-full my-4"></div>
    <!-- block editor -->
    <editor
      v-validate-perm
      data-perm="lessons/update"
      id="lesson-form"
      :model-value="lesson"
      @update:modelValue="updateLesson"
    />
    <!-- save button -->
    <div class="mt-4 flex justify-end">
      <button
        v-validate-perm
        data-perm="lessons/update"
        type="button"
        :disabled="loading"
        @click="save"
        class="
          bg-green-500
          text-white
          rounded
          px-4
          py-2
          hover:bg-green-600
          focus:outline-none
        "
      >
        <i class="fas fa-save"></i>
        Save
      </button>
    </div>
    <!-- content if form is null -->
    <div v-if="showContent" v-html="clearContent(lesson.content)"></div>
    <!-- prev next buttons -->
    <div class="mt-4 flex justify-between">
      <!-- prev -->
      <button
        type="button"
        :disabled="loading"
        @click="prevnext('prev')"
        class="
          bg-green-500
          text-white
          rounded
          px-4
          py-2
          hover:bg-green-600
          focus:outline-none
        "
      >
        <i class="fas fa-chevron-left"></i>
        Previous
      </button>
      <!-- next -->
      <button
        type="button"
        :disabled="loading"
        @click="prevnext('next')"
        class="
          bg-green-500
          text-white
          rounded
          px-4
          py-2
          hover:bg-green-600
          focus:outline-none
        "
      >
        Next
        <i class="fas fa-chevron-right"></i>
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

import { LessonI } from '@/store/lessons/state';
import { ModuleI } from '@/store/modules/state';

const editor = defineAsyncComponent(() => import('@/components/global/block-editor.vue'));

const store = useStore();
const route = useRoute();
const router = useRouter();

const lesson = computed<LessonI>(() => store.state.lessons.lesson);
const m = computed<ModuleI>(() => store.state.modules.module);

const loading = ref(false);
const showContent = ref<boolean>(false);

function setTitle() {
  document.title = `${lesson.value.title} - dg-inventory`;
}

function checkAvailableContent() {
  const formEl = document.getElementById('lesson-form') as HTMLFormElement;
  showContent.value = !formEl;
}

function updateLesson(newValue: any) {
  store.commit('lessons/setLesson', {
    ...lesson.value,
    ...newValue,
  });
}

function clearContent(content: string) {
  let newcontent = content;
  // remove contenteditable tags
  newcontent = content.replace(/contenteditable="true"/g, '');
  // remove button with the following classes
  // bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600
  const regex = /<button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600" type="button">\+<\/button>/g;

  newcontent = newcontent.replace(regex, '');

  return newcontent;
}

async function getLesson() {
  loading.value = true;
  try {
    const title = route.params.id as string;
    const id = title.split('-').pop() as string;
    await store.dispatch('lessons/get', id);
    checkAvailableContent();
    setTitle();
    await store.dispatch('modules/get', lesson.value.moduleId);
  } catch (error: any) {
    console.error(error);
    const msg = error.response.data.error || 'An error occurred getting lesson';
    store.commit('notifications/addNotification', { text: msg, type: 'error' });
  } finally {
    loading.value = false;
  }
}

async function save() {
  loading.value = true;
  try {
    await store.dispatch('lessons/update', lesson.value);
    store.commit('notifications/addNotification', {
      message: 'Lesson updated successfully',
      type: 'success',
    });
    router.push(`/app/lessons/${lesson.value.moduleId}`);
  } catch (error: any) {
    console.error(error);
    const msg = error.response.data.error || 'An error occurred updating lesson';
    store.commit('notifications/addNotification', { message: msg, type: 'error' });
  } finally {
    loading.value = false;
  }
}

async function prevnext(direction: string) {
  loading.value = true;
  try {
    const l = await store.dispatch('lessons/prevnext', {
      id: lesson.value.id,
      direction,
    });
    window.location.href = `/app/lessons/content/${l.title}-${l.id}`;
  } catch (error: any) {
    console.error(error);
    const msg = error.response.data.error || 'An error occurred getting lesson';
    if (error.status === 404) {
      // redirect to module
      router.push(`/app/lessons/${lesson.value.moduleId}`);
      return;
    }
    store.commit('notifications/addNotification', {
      message: msg,
      type: 'error',
    });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getLesson();
});

</script>
