<template>
  <div class="bg-white p-4">
    <h2 class="text-lg font-semibold mb-4 text-green-500">
      {{ course.title }}
    </h2>
    <!-- line -->
    <div class="bg-gray-200 h-0.5 w-full mb-4"></div>
    <!-- form -->
    <form
      v-validate-perm
      data-perm="courses/update"
      @submit.prevent="saveCourse"
      id="course-form"
    >
      <div class="grid grid-cols-1 gap-4">
        <!-- input -->
        <div>
          <label for="course-title" class="text-sm font-semibold"> Course title </label>
          <input
            type="text"
            id="course-title"
            v-model="course.title"
            class="
              w-full
              border border-gray-300
              rounded p-2
              focus:outline
            "
          />
        </div>
        <!-- editor -->
        <div>
          <label for="course-description" class="text-sm font-semibold"> Course description </label>
          <editor
            :content="course.description"
            @update:content="course.description = $event"
          />
        </div>
        <!-- button -->
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="loading"
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
            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
            Save
          </button>
        </div>
      </div>
    </form>
    <div
      v-if="justSee"
      v-html="course.description"
      class="mt-4"
    ></div>
    <!-- enroll button -->
    <div class="mt-4">
      <button
        v-validate-perm
        data-perm="courses/enroll"
        type="button"
        :disabled="loading"
        @click="enrollCourse"
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
        Explore
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

import { CourseI } from '@/store/courses/state';

const editor = defineAsyncComponent(() => import('@/components/global/WYSIWYG-editor.vue'));

const store = useStore();
const route = useRoute();
const router = useRouter();

const course = computed<CourseI>(() => store.state.courses.course);

const loading = ref(false);
const justSee = ref(false);

function setCourseTitle() {
  document.title = `${course.value.title} - dg-inventory`;
}

function checkCourseForm() {
  const formEl = document.getElementById('course-form') as HTMLFormElement;
  if (formEl) justSee.value = false;
  else justSee.value = true;
}

async function getCourse() {
  loading.value = true;
  try {
    const name = route.params.id as string;
    const splitedName = name.split('-');
    const id = splitedName[splitedName.length - 1];
    await store.dispatch('courses/get', id);
    setCourseTitle();
    checkCourseForm();
  } catch (error: any) {
    console.error(error);
    const msg = error.response.data.error || error.message;
    store.commit('notifications/addNotification', { text: msg, type: 'error' });
  } finally {
    loading.value = false;
  }
}

async function saveCourse() {
  loading.value = true;
  try {
    await store.dispatch('courses/update', course.value);
    store.commit('notifications/addNotification', {
      message: 'Course updated',
      type: 'success',
    });
    router.push('/app/courses');
  } catch (error: any) {
    console.error(error);
    const msg = error.response.data.error || error.message;
    store.commit('notifications/addNotification', {
      message: msg,
      type: 'error',
    });
  } finally {
    loading.value = false;
  }
}

async function enrollCourse() {
  loading.value = true;
  try {
    await store.dispatch('courses/enroll', {
      courseId: course.value.id,
    });
    store.commit('notifications/addNotification', {
      message: 'Course enrolled',
      type: 'success',
    });
    router.push(`/app/modules/${course.value.id}`);
  } catch (error: any) {
    console.error(error);
    const msg = error.response.data.error || 'Error enrolling course';
    store.commit('notifications/addNotification', {
      message: msg,
      type: 'error',
    });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getCourse();
});

</script>
