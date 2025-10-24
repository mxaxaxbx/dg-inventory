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
    <Form
      :fields="fields"
      :loading="loading"
      @update="update"
      @submit="submit"
    />
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
import { ModuleI } from '@/store/modules/state';
import { CustomFormStateI } from '@/store/custom-form/state';

const Form = defineAsyncComponent(() => import('@/components/global/custom-form.vue'));

const store = useStore();
const route = useRoute();
const router = useRouter();

const course = computed<CourseI>(() => store.state.courses.course);

const loading = ref(false);
const fields = ref<CustomFormStateI[]>([
  {
    value: '',
    name: 'title',
    label: 'Título',
    disabled: false,
    type: 'text',
    required: true,
  },
  {
    value: '',
    name: 'description',
    label: 'Descripción',
    disabled: false,
    type: 'textarea',
    required: true,
  },
]);

function update(updatedField: CustomFormStateI) {
  const field = fields.value.find((f) => f.name === updatedField.name);

  if (field) {
    field.value = updatedField.value;
  }
}

async function submit() {
  loading.value = true;

  try {
    const payload = fields.value.reduce((acc, field) => {
      acc[field.name as keyof ModuleI] = field.value as never;
      return acc;
    }, {} as ModuleI);

    payload.courseId = course.value.id;

    await store.dispatch('modules/add', payload);
    store.commit('notifications/addNotification', {
      message: 'Módulo creado exitosamente',
      type: 'success',
    });

    router.push(`/app/modules/${course.value.id}`);
  } catch (error: any) {
    console.log('error', error);
    const msg = error.response?.data?.error || 'Ocurrió un error al crear el módulo';
    store.commit('notifications/addNotification', {
      message: msg,
      type: 'error',
    });
  } finally {
    loading.value = false;
  }
}

function setTitle() {
  document.title = `Agregar módulo ${course.value.title} - digi-edu`;
}

async function getCourse() {
  loading.value = true;
  try {
    const courseId = route.params.courseId as string;
    await store.dispatch('courses/get', courseId);
    setTitle();
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
