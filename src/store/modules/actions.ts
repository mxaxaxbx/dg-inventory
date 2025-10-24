import { ActionTree, ActionContext } from 'vuex';

import { eduClient } from '@/http-client';
import { camelToSnake, snakeToCamel } from '@/utils';

import { RootStateI, PaginationI } from '../state';
import { ModuleI, ModulesStateI } from './state';

export const actions: ActionTree<ModulesStateI, RootStateI> = {
  async getbycourse(
    context: ActionContext<ModulesStateI, RootStateI>,
    payload: number,
  ): Promise<void> {
    const { data } = await eduClient.get(`/api/modules/getbycourse/${payload}`);
    context.commit('setModules', snakeToCamel(data));
  },
  async add(
    context: ActionContext<ModulesStateI, RootStateI>,
    payload: ModuleI,
  ): Promise<void> {
    await eduClient.post('/api/modules/add', camelToSnake(payload));
  },
  async get(
    context: ActionContext<ModulesStateI, RootStateI>,
    payload: number,
  ): Promise<void> {
    const { data } = await eduClient.get(`/api/modules/get/${payload}`);
    context.commit('setModule', snakeToCamel(data));
  },
  async update(
    context: ActionContext<ModulesStateI, RootStateI>,
    payload: ModuleI,
  ): Promise<void> {
    await eduClient.patch('/api/modules/update', camelToSnake(payload));
  },
  async enroll(
    context: ActionContext<ModulesStateI, RootStateI>,
    payload: { moduleId: number },
  ): Promise<void> {
    await eduClient.post('/api/modules/enroll', camelToSnake(payload));
  },
};
