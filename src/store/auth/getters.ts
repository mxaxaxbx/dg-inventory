import { GetterTree } from 'vuex';

import { decode } from '@/utils/custom-enc-dec';

import {
  AuthStateI,
  UserI,
  ProjectI,
  PermissionI,
} from './state';
import { RootStateI } from '../state';

export const getters: GetterTree<AuthStateI, RootStateI> = {
  isAuth: (state) => {
    const token = localStorage.getItem('token');
    return !!token;
  },
  user: (state) => {
    const encodedUser = localStorage.getItem('user');
    if (!encodedUser) return state.user;
    const { value } = decode(encodedUser);
    return typeof value === 'string' ? JSON.parse(value) : value;
  },
  projects: (state) => {
    const encodedProjects = localStorage.getItem('projects');
    if (!encodedProjects) return state.projects;
    const { value } = decode(encodedProjects);
    return typeof value === 'string' ? JSON.parse(value) : value;
  },
  project: (state) => {
    const encodedProject = localStorage.getItem('project');
    if (!encodedProject) return state.project;
    const project: any = decode(encodedProject).value;
    const projectMapped: any = {};
    Object.keys(project).forEach((key) => {
      if (key === 'ID') {
        projectMapped.id = Number(project[key]);
        return;
      }
      // convert the first letter of the key to lowercase
      const newKey = key.charAt(0).toLowerCase() + key.slice(1);
      projectMapped[newKey] = project[key];
    });
    return projectMapped as ProjectI;
  },
  permissions: (state) => {
    const encodedPermissions = localStorage.getItem('permissions');
    if (!encodedPermissions) return state.permissions;
    const permissions = decode(encodedPermissions).value as any[];
    const permissionsMapped = permissions.map((permission: any) => {
      const p: any = {};
      Object.keys(permission).forEach((key) => {
        if (key === 'ID') {
          p.id = Number(permission[key]);
          return;
        }
        // convert the first letter of the key to lowercase
        const newKey = key.charAt(0).toLowerCase() + key.slice(1);
        p[newKey] = permission[key];
      });
      return p as PermissionI;
    });
    return permissionsMapped as PermissionI[];
  },
};
