import { GetterTree } from 'vuex';

import { decode } from '@/utils/custom-enc-dec';

import {
  ProjectsStateI,
} from './state';
import { RootStateI } from '../state';

export const getters: GetterTree<ProjectsStateI, RootStateI> = {
};
