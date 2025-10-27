<template>
  <div class="bg-white p-4">
    <router-link
      :to="`/app/modules/${m.id}`"
      class="text-lg font-semibold mb-4 text-green-500"
    >
      {{ m.title }}
    </router-link>
    <!-- line -->
    <div class="bg-gray-200 h-0.5 w-full my-4"></div>
    <Form
      v-validate-perm
      data-perm="modules/update"
      id="module-form"
      :fields="fields"
      :loading="loading"
      @update="update"
      @submit="submit"
    />
    <!-- content if form is null -->
    <div v-if="showContent">
      <p>
        {{ m.description }}
      </p>
    </div>
    <!-- enroll button -->
    <div class="mt-4">
      <button
        v-validate-perm
        data-perm="courses/enroll"
        type="button"
        :disabled="loading"
        @click="enroll"
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
import { ModuleI } from '@/store/modules/state';
import { CustomFormStateI } from '@/store/custom-form/state';

const Form = defineAsyncComponent(() => import('@/components/global/custom-form.vue'));

const store = useStore();
const route = useRoute();
const router = useRouter();

const m = computed<ModuleI>(() => store.state.modules.module);

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
const showContent = ref<boolean>(false);

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

    payload.id = m.value.id;
    payload.order = m.value.order;
    payload.courseId = m.value.courseId;

    await store.dispatch('modules/update', payload);
    store.commit('notifications/addNotification', {
      message: 'Módulo actualizado',
      type: 'success',
    });

    router.push(`/app/modules/${m.value.courseId}`);
  } catch (error: any) {
    console.log('error', error);
    const msg = error.response?.data?.error || 'Ocurrió un error al actualizar el módulo';
    store.commit('notifications/addNotification', {
      message: msg,
      type: 'error',
    });
  } finally {
    loading.value = false;
  }
}

function setTitle() {
  document.title = `${m.value.title} - dg-inventory`;
}

function checkAvailableContent() {
  const formEl = document.getElementById('module-form') as HTMLFormElement;
  showContent.value = !formEl;
}

function fillFields() {
  fields.value.forEach((field) => {
    // eslint-disable-next-line no-param-reassign
    if (field.name === 'title') field.value = m.value.title;
    // eslint-disable-next-line no-param-reassign
    if (field.name === 'description') field.value = m.value.description;
  });
  checkAvailableContent();
}

async function getModule() {
  loading.value = true;
  try {
    const title = route.params.id as string;
    const id = title.split('-').pop() as string;
    await store.dispatch('modules/get', id);
    setTitle();
    fillFields();
  } catch (error: any) {
    console.error(error);
    const msg = error.response.data.error || 'An error occurred getting module';
    store.commit('notifications/addNotification', { text: msg, type: 'error' });
  } finally {
    loading.value = false;
  }
}

async function enroll() {
  loading.value = true;
  try {
    await store.dispatch('modules/enroll', {
      moduleId: m.value.id,
    });
    router.push(`/app/lessons/${m.value.id}`);
  } catch (error: any) {
    console.error(error);
    const msg = error.response.data.error || 'Error enrolling module';
    store.commit('notifications/addNotification', {
      message: msg,
      type: 'error',
    });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getModule();
});

</script>
