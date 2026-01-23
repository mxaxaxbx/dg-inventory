import { ActionTree, ActionContext } from 'vuex';

import { usersClient } from '@/http-client';
import { camelToSnake } from '@/utils';

import { RootStateI } from '../state';
import { ProjectsStateI, ProjectI } from './state';

export const actions: ActionTree<ProjectsStateI, RootStateI> = {
  async checkProjects(context: ActionContext<ProjectsStateI, RootStateI>) {
    await context.dispatch('auth/getUserProjects', {}, { root: true });
    const projects: ProjectI[] = context.rootGetters['auth/projects'];
    if (projects.length === 0) {
      window.location.href = '/app/projects/add?ref=dashboard';
      return;
    }
    console.log('projects->', projects);
    throw new Error('test');
  },

  async add(context: ActionContext<ProjectsStateI, RootStateI>, payload: ProjectI) {
    const { data } = await usersClient.post('/api/projects/create?app=inventory', camelToSnake(payload));
    console.log('data', data);
  },

};
