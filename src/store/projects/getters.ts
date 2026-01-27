import { GetterTree } from 'vuex';

import { decode } from '@/utils/custom-enc-dec';

import {
  ProjectsStateI,
  StoreI,
} from './state';
import { RootStateI } from '../state';

export const getters: GetterTree<ProjectsStateI, RootStateI> = {
  store: (state) => {
    const encodedProject = localStorage.getItem('store');
    if (!encodedProject) return state.store;
    return decode(encodedProject).value as StoreI;
  },
  stores: (state) => {
    const encodedStores = localStorage.getItem('stores');
    if (!encodedStores) return state.stores;
    return decode(encodedStores).value as StoreI[];
  },
};
