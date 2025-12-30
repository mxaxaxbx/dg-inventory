import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/home.vue'),
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  },
  // auth routes
  {
    path: '/auth',
    name: 'auth',
    component: () => import('../views/auth/index.vue'),
    children: [
      {
        path: 'confirmsession',
        name: 'confirmsession',
        component: () => import('../views/auth/confirmsession.vue'),
        meta: {
          title: 'Verificando sesión',
        },
      },
    ],
  },
  // app routes
  {
    path: '/app',
    name: 'app',
    component: () => import('../views/app/index.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'app-home',
        // component: () => import('../views/app/home.vue'),
        meta: {
          title: 'Inicio',
        },
        redirect: { name: 'app-dashboard' },
      },
      // dashboard
      {
        path: 'dashboard',
        name: 'app-dashboard',
        component: () => import('../views/app/dashboard/index.vue'),
        meta: {
          title: 'Dashboard',
        },
      },
      // projects
      {
        path: 'projects',
        name: 'app-projects',
        component: () => import('../views/app/projects/index.vue'),
        meta: {
          title: 'Proyectos',
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  // Set title
  if (to.meta.title) {
    document.title = `${to.meta.title} - dg-inventory`;
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!localStorage.getItem('token')) {
      const { VUE_APP_DG_USERS_APP } = process.env;
      window.location.href = `${VUE_APP_DG_USERS_APP}/auth/provider?app=inventory`;
    } else {
      next();
    }
  }
  next();
});

export default router;
