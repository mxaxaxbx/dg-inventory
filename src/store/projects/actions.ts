import { ActionTree, ActionContext } from 'vuex';

import { usersClient } from '@/http-client';
import { camelToSnake } from '@/utils';

import { RootStateI } from '../state';
import { ProjectsStateI, ProjectI } from './state';

export const actions: ActionTree<ProjectsStateI, RootStateI> = {
  async add(context: ActionContext<ProjectsStateI, RootStateI>, payload: ProjectI) {
    const { data } = await usersClient.post('/api/projects/create', camelToSnake(payload));
  },
};
