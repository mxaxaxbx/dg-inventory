import { MutationTree } from 'vuex';

import {
  LessonI,
  LessonsStateI,
} from './state';

export const mutations: MutationTree<LessonsStateI> = {
  setLessons(state: LessonsStateI, payload: LessonI[]) {
    state.lessons = payload;
  },
  setLesson(state: LessonsStateI, payload: LessonI) {
    state.lesson = payload;
  },
};
