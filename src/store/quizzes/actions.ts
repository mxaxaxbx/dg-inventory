import { ActionTree, ActionContext } from 'vuex';

import { eduClient } from '@/http-client';
import { camelToSnake, snakeToCamel } from '@/utils';

import { RootStateI } from '../state';
import {
  QuizExtructureI,
  QuizzesStateI,
  QuizzQuestionI,
  QuizzAnswerI,
} from './state';

export const actions: ActionTree<QuizzesStateI, RootStateI> = {
  async create(
    context: ActionContext<QuizzesStateI, RootStateI>,
    payload: QuizExtructureI,
  ): Promise<void> {
    await eduClient.post('/api/quizzes/create', camelToSnake(payload));
  },
};
