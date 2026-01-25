import { MutationTree } from 'vuex';

import { decode, encode } from '@/utils/custom-enc-dec';

import { StoreI, ProjectsStateI } from './state';

export const mutations: MutationTree<ProjectsStateI> = {
  setStores(state: ProjectsStateI, payload: StoreI[]) {
    state.stores = payload;
    const storesEncoded = encode(payload);
    localStorage.setItem('stores', storesEncoded);
  },
  setStore(state: ProjectsStateI, payload: StoreI) {
    // check if the store is already in the browser storage
    const storeEncoded = localStorage.getItem('store');
    if (storeEncoded) {
      const { value } = decode(storeEncoded);
      state.store = value as StoreI;
      return;
    }
    state.store = payload;
    const storeEncoded2 = encode(payload);
    localStorage.setItem('store', storeEncoded2);
  },
};
