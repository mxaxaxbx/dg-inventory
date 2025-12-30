<template>
  <div class="absolute inset-0 bg-gray-200 flex flex-col">
    <Notifications />

    <!-- Dark overlay -->
    <div
      v-if="showSidebar"
      class="fixed inset-0 bg-black opacity-50 z-30"
      @click="toggleSidebar"
      @keydown="toggleSidebar"
    ></div>

    <!-- menu - fixed -->
    <div
      v-click-outside="clickOutside"
      class="w-full sticky z-40 top-0 left-0 right-0"
    >
      <NavBar/>
      <Sidebar />
    </div>

    <!-- content - with proper top padding to account for fixed header -->
    <div class="flex-1">
      <router-view />
    </div>

    <!-- footer -->
    <footer class="bg-gray-800 text-white py-8">
      <div class="container mx-auto text-center">
        <p>&copy; 2024 dg-inventory. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed } from 'vue';
import { useStore } from 'vuex';

const NavBar = defineAsyncComponent(() => import('./components/global/nav-bar.vue'));
const Sidebar = defineAsyncComponent(() => import('@/components/global/sidebar.vue'));
const Notifications = defineAsyncComponent(() => import('@/components/global/notifications.vue'));

const store = useStore();

const showSidebar = computed(() => store.state.sidebar);

function clickOutside() {
  if (showSidebar.value) store.commit('toggleSidebar');
}

function toggleSidebar() {
  store.commit('toggleSidebar');
}

</script>

<style scoped>
.blocker {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background-color: rgba(0, 0, 0, 0.9); /* Change the alpha value for darkness */
  z-index: 20; /* Ensure it's above the sidebar */
}
</style>
