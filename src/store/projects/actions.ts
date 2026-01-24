import { ActionTree, ActionContext } from 'vuex';

import { usersClient, invClient } from '@/http-client';
import { camelToSnake } from '@/utils';

import { RootStateI } from '../state';
import { ProjectsStateI, ProjectI, StoreI } from './state';

export const actions: ActionTree<ProjectsStateI, RootStateI> = {
  async checkProjects(context: ActionContext<ProjectsStateI, RootStateI>) {
    await context.dispatch('auth/getUserProjects', {}, { root: true });
    const projects: ProjectI[] = context.rootGetters['auth/projects'];
    if (projects.length === 0) {
      window.location.href = '/app/projects/add?ref=auth';
      return;
    }
    await context.dispatch('syncProjects');
    throw new Error('test');
  },

  async add(context: ActionContext<ProjectsStateI, RootStateI>, payload: ProjectI) {
    const { data } = await usersClient.post('/api/projects/create?app=inventory', camelToSnake(payload));
    console.log('data', data);
  },

  async syncProjects(context: ActionContext<ProjectsStateI, RootStateI>) {
    const projects: ProjectI[] = context.rootGetters['auth/projects'];
    const currentStore: StoreI = context.state.store;
    await Promise.all(projects.map(async (project) => {
      const store: StoreI = {
        ...currentStore,
        name: project.name,
      };
      const { data } = await invClient.post('/api/general-requests/stores', camelToSnake(store));
      console.log('data', data);
    }));
  },

};
