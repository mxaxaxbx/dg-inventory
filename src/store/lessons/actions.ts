import { ActionTree, ActionContext } from 'vuex';

import { eduClient } from '@/http-client';
import { camelToSnake, snakeToCamel } from '@/utils';

import { RootStateI } from '../state';
import { LessonI, LessonsStateI } from './state';

export const actions: ActionTree<LessonsStateI, RootStateI> = {
  async getbymodule(
    context: ActionContext<LessonsStateI, RootStateI>,
    payload: number,
  ): Promise<void> {
    const { data } = await eduClient.get(`/api/lessons/getbymodule/${payload}`);
    context.commit('setLessons', snakeToCamel(data));
  },
  async add(
    context: ActionContext<LessonsStateI, RootStateI>,
    payload: LessonI,
  ): Promise<void> {
    const { content } = payload;
    const newContent = content.replace(/<button class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-blue-600" type="button">\+<\/button>/g, '');
    const newPayload = { ...payload, content: newContent };
    await eduClient.post('/api/lessons/add', camelToSnake(newPayload));
  },
  async get(
    context: ActionContext<LessonsStateI, RootStateI>,
    payload: number,
  ): Promise<void> {
    const { data } = await eduClient.get(`/api/lessons/get/${payload}`);
    context.commit('setLesson', snakeToCamel(data));
  },
  async update(
    context: ActionContext<LessonsStateI, RootStateI>,
    payload: LessonI,
  ): Promise<void> {
    const { content } = payload;
    const newContent = content.replace(/<button class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-blue-600" type="button">\+<\/button>/g, '');
    const newPayload = { ...payload, content: newContent };
    await eduClient.patch('/api/lessons/update', camelToSnake(newPayload));
  },
  async prevnext(
    context: ActionContext<LessonsStateI, RootStateI>,
    payload: {
      id: number;
      direction: string;
    },
  ): Promise<void> {
    const { data } = await eduClient.get(`/api/lessons/nextprev/${payload.id}?direction=${payload.direction}`);
    return data;
  },
};
