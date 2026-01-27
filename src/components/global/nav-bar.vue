<template>
  <div class="bg-gray-100 h-12" :class="{ 'highlighted bg-gray-200': highlight }">
    <nav class="flex items-center justify-between px-6 py-1">
      <div class="flex items-center">
        <button
          @click="toggleSidebar"
          type="button"
          class="
            text-gray-800
            hover:text-gray-400
            focus:outline-none focus:text-gray-400
            mr-2
          "
        >
          <i class="fas fa-bars"></i>
        </button>
        <!-- brand -->
        <div class="flex items-center space-x-2">
          <router-link
            :to="isAuth ? '/app' : '/'"
            class="text-xl font-bold"
          >
            inventory
          </router-link>
          <!-- store selector -->
          <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
          <select
            name="COMP_Nombre"
            id="COMP_Nombre"
            class="select-css"
          >
            <option selected disabled value="0">Seleccione una tienda</option>
            <option
              v-for="s in stores"
              :key="s.id"
              :value="s.id"
              :selected="s.id === st.id"
            >
              {{ s.name }}
            </option>
          </select>
        </div>
      </div>
      <!-- search and user -->
      <Dropdown v-if="isAuth">
        <template #trigger="{ toggle }">
          <button
            @click="toggle"
            class="
              relative
              flex items-center justify-center
              rounded-full
              bg-gray-200 text-gray-700
              hover:bg-gray-300
              focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-all duration-150 h-10 w-10
            "
          >
            <!-- User initials -->
            <span
              v-if="user.firstName && user.lastName"
              class="font-semibold text-sm uppercase"
            >
              {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
            </span>

            <!-- Fallback icon -->
            <i
              v-else
              class="fas fa-user text-gray-500 text-lg"
              aria-hidden="true"
            ></i>

            <!-- Optional status indicator -->
            <span
              class="
                absolute
                bottom-0 right-0
                block
                h-2.5 w-2.5
                rounded-full
                bg-green-500
                border-2 border-white
              "
            ></span>
          </button>
        </template>

        <template #content="{}">
          <!-- Avatar, email, user name -->
          <div class="flex flex-col items-center">
            <div class="relative --w-16 --h-16">
              <!-- <img
                src="https://via.placeholder.com/64"
                alt="Avatar"
                class="rounded-full w-full h-full object-cover border"
              /> -->
              <div
                class="absolute bottom-0 right-0 bg-gray-100 p-1 rounded-full border"
              >
              </div>
            </div>

            <h2 class="mt-2 text-lg font-bold text-gray-800">
              {{ user.firstName }} {{ user.lastName }}
            </h2>

            <!-- Email -->
            <div class="text-center mt-2">
              <p class="text-gray-500 text-sm mb-2">
                {{ user.email }}
              </p>
            </div>

            <!-- Manage Account Button -->
            <a
              :href="`${usersLink}/app/users/edit-profile`"
              class="
                mt-2 text-blue-600
                border border-gray-300 rounded-full
                px-4 py-1
                text-sm
                hover:bg-gray-50 transition
              "
            >
              Manage your digi Account
            </a>
          </div>

          <!-- Divider -->
          <hr class="my-4" />

          <!-- Actions -->
          <div class="flex flex-col space-y-2">
            <button
              @click="logout"
              class="
                flex items-center justify-around
                w-full
                rounded-lg
                px-4 py-2
                hover:bg-gray-100 transition
                text-sm
              "
            >
              <span class="flex items-center space-x-2">
                <i class="fas fa-sign-out-alt"></i>
                <span>Sign out</span>
              </span>
            </button>
          </div>

          <!-- Footer -->
          <div
            class="flex justify-around mt-4 text-xs text-gray-500 px-20"
          >
            <a
              :href="`${usersLink}/privacy-policy`"
              class="hover:underline"
            >
              Privacy Policy
            </a>
            <span> | </span>
            <a href="#" class="hover:underline">Terms of Service</a>
          </div>
        </template>
      </Dropdown>
      <div v-else>
        <a :href="`${usersLink}/auth/provider?app=inventory`" aria-label="User Profile">
          <i class="fas fa-user" aria-hidden="true"></i>
          <span class="sr-only">User Profile</span>
        </a>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  defineProps,
  PropType,
  computed,
  defineAsyncComponent,
} from 'vue';
import { useStore } from 'vuex';

import { UserI } from '@/store/auth/state';
import { StoreI } from '@/store/projects/state';

const Dropdown = defineAsyncComponent(() => import('@/components/global/dropdown.vue'));

const store = useStore();

const { VUE_APP_DG_USERS_APP } = process.env;
const usersLink = ref(`${VUE_APP_DG_USERS_APP}`);

const stores = computed<StoreI[]>(() => store.getters['projects/stores']);
const st = computed<StoreI>(() => store.getters['projects/store']);

const user = computed<UserI>(() => store.getters['auth/user']);
const isAuth = computed<boolean>(() => store.getters['auth/isAuth']);

const toggleSidebar = () => {
  store.commit('toggleSidebar');
};

const logout = () => {
  store.dispatch('auth/logout');
};

</script>

<style scoped>
option:hover {
  background-color: #000;
  border-radius: .2em;
}
select option:hover,
select option:focus,
select option:active {
  background: linear-gradient(#1AA26E, #1AA26E);
  background-color: #000 !important; /* for IE */
  color: #fff !important;
}
select option:checked {
  background: linear-gradient(#000, #000);
  background-color: #000 !important;
}
.select-css {
  display: block;
  font-size: 16px;
  font-family: 'Arial', sans-serif;
  font-weight: 400;
  color: #fff;
  line-height: 1.3;
  padding: .2em 0.4em .2em .5em;
  width: 120px;
  max-width: 100%;
  box-sizing: border-box;
  margin: 0;
  border: 2px solid #000;
  box-shadow: 0 1px 0 1px rgba(204,20,20,.03);
  border-radius: .3em;
  background-repeat: no-repeat, repeat;
  background-position: right .7em top 50%, 0 0;
  background-size: .65em auto, 100%;
  background: #000;
}
.select-css::-ms-expand {
  display: none;
}
.select-css:hover {
  border-color: #077474;
  background-color: #000;
  /*box-shadow: 0 0 10px 100px #000 inset;*/
}
.select-css:focus {
  color: #fff;
  border-color: #077474;
  box-shadow: 0 0 1px 3px rgba(31, 131, 66, .7);
  outline: none;
}
</style>
