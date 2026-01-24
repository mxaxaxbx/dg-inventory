export interface StoreI {
  id: number;
  userId: number;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  storeType: string;
  isVerified: boolean;
  isActive: boolean;
  reputationScore: number;
  totalSales: number;
  created: number;
  updated: number;
}
export interface ProjectI {
  id: number;
  name: string;
}

export interface ProjectsStateI {
  project: ProjectI;
  projects: ProjectI[];
  store: StoreI;
}

export const state: ProjectsStateI = {
  project: {
    id: 0,
    name: '',
  },
  projects: [],
  store: {
    id: 0,
    userId: 0,
    name: '',
    slug: '',
    description: '',
    logoUrl: '',
    bannerUrl: '',
    storeType: '',
    isVerified: false,
    isActive: false,
    reputationScore: 0,
    totalSales: 0,
    created: 0,
    updated: 0,
  },
};
