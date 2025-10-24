import { MutationTree } from 'vuex';

import {
  ModuleI,
  ModulesStateI,
} from './state';

export const mutations: MutationTree<ModulesStateI> = {
  setModules(state: ModulesStateI, payload: ModuleI[]) {
    state.modules = payload;
  },
  setModule(state: ModulesStateI, payload: ModuleI) {
    state.module = payload;
  },
};
