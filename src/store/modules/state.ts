export interface ModuleI {
  courseId: number;
  description: string;
  id: number;
  order: number;
  title: string;
}

export interface ModulesStateI {
  modules: ModuleI[];
  module: ModuleI;
}

export const state: ModulesStateI = {
  modules: [],
  module: {
    courseId: 0,
    description: '',
    id: 0,
    order: 0,
    title: '',
  },
};
