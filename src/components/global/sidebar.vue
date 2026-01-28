<template>
  <aside
    v-show="showSidebar"
    id="default-sidebar"
    class="
      fixed z-40 w-64 h-screen
      border border-gray-300
      highlighted
    "
    aria-label="Sidebar"
  >
    <div
      class="
        h-full
        flex flex-col
        px-3 py-4
        bg-gray-100
      "
    >
      <h3 class="text-lg font-bold text-gray-900">Menú</h3>
      <!-- authenticated menu -->
      <ul v-if="isAuth" class="space-y-2 font-medium">
        <!-- teachers -->
        <li v-if="validatePermissions('teachers/filter')">
          <router-link
            to="/app/teachers"
            class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
          >
            <i class="fas fa-chalkboard-teacher w-5 h-5 text-gray-500"></i>
            <span class="flex-1 ml-3 whitespace-nowrap"> Docentes </span>
          </router-link>
        </li>
        <!-- courses -->
        <li v-if="validatePermissions('courses/filter')">
          <router-link
            to="/app/courses"
            class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
          >
            <i class="fas fa-book w-5 h-5 text-gray-500"></i>
            <span class="flex-1 ml-3 whitespace-nowrap"> Cursos </span>
          </router-link>
        </li>
        <!-- stores -->
        <li>
          <router-link
            to="/app/projects"
            class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
          >
            <i class="fas fa-store w-5 h-5 text-gray-500"></i>
            <span class="flex-1 ml-3 whitespace-nowrap"> Tiendas </span>
          </router-link>
        </li>
        <!-- inventory -->
        <li>
          <router-link
            to="/app/inventory"
            class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
          >
            <i class="fas fa-box w-5 h-5 text-gray-500"></i>
            <span class="flex-1 ml-3 whitespace-nowrap"> Inventario </span>
          </router-link>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

import { PermissionI, ProjectI } from '@/store/auth/state';

const store = useStore();
const route = useRoute();

const showSidebar = computed(() => store.state.sidebar);

const isAuth = computed(() => store.getters['auth/isAuth']);
const permissions = computed<PermissionI[]>(() => store.getters['auth/permissions']);

function validatePermissions(perm: string) {
  const permSplit = perm.split('/');
  const resource = permSplit[0];
  const name = permSplit[1];
  const exists = permissions.value.some((p) => p.resourceName === resource && p.name === name);
  return exists;
}

function changeProject(ev: Event) {
  const projectID = (ev.target as HTMLSelectElement).value;
  store.dispatch('auth/changeProject', Number(projectID));
}

// check if the path has changed, then close the sidebar
watch(() => route.path, () => {
  store.commit('closeSidebar');
});

</script>
