import { ActionTree, ActionContext } from 'vuex';

import { usersClient, invClient } from '@/http-client';
import { camelToSnake } from '@/utils';

import { RootStateI } from '../state';
import { ProjectsStateI, ProjectI, StoreI } from './state';

export const actions: ActionTree<ProjectsStateI, RootStateI> = {
  async checkProjects(context: ActionContext<ProjectsStateI, RootStateI>) {
    await context.dispatch('checkStores');
    await context.dispatch('setStores');
  },

  async checkStores(context: ActionContext<ProjectsStateI, RootStateI>) {
    const { data } = await invClient.get('/api/general-requests/stores?count=true');
    const { count } = data;
    if (count === 0) {
      window.location.href = '/app/projects/add?ref=auth';
      throw new Error('No stores found. Redirecting to add store page.');
    }
  },

  async addProject(context: ActionContext<ProjectsStateI, RootStateI>, payload: ProjectI) {
    await usersClient.post('/api/projects/create?app=inventory', camelToSnake(payload));
    const currentStore: StoreI = context.state.store;
    const store: StoreI = {
      ...currentStore,
      name: payload.name,
    };
    await context.dispatch('addStore', store);
  },

  async syncProjects(context: ActionContext<ProjectsStateI, RootStateI>) {
    const projects: ProjectI[] = context.rootGetters['auth/projects'];
    const currentStore: StoreI = context.state.store;
    await Promise.all(projects.map(async (project) => {
      const store: StoreI = {
        ...currentStore,
        name: project.name,
      };
      await context.dispatch('addStore', store);
    }));
  },

  async addStore(context: ActionContext<ProjectsStateI, RootStateI>, payload: StoreI) {
    await invClient.post('/api/general-requests/stores', camelToSnake(payload));
  },

  async setStores(context: ActionContext<ProjectsStateI, RootStateI>) {
    const { data } = await invClient.get('/api/general-requests/stores');
    context.commit('setStores', data);
    context.commit('setStore', data[0]);
  },

};
