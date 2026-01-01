export interface ProjectI {
  id: number;
  name: string;
}

export interface ProjectsStateI {
  project: ProjectI;
  projects: ProjectI[];
}

export const state: ProjectsStateI = {
  project: {
    id: 0,
    name: '',
  },
  projects: [],
};
