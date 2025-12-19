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
        redirect: { name: 'app-courses-list' },
      },
      // teachers
      {
        path: 'teachers',
        name: 'app-teachers',
        component: () => import('../views/app/teachers/index.vue'),
        children: [
          {
            path: '',
            name: 'app-teachers-list',
            component: () => import('../views/app/teachers/list.vue'),
            meta: {
              title: 'Docentes',
            },
          },
          {
            path: 'find',
            name: 'app-teachers-find',
            component: () => import('../views/app/teachers/find.vue'),
            meta: {
              title: 'Buscar docente',
            },
          },
          {
            path: 'new',
            name: 'app-teachers-new',
            component: () => import('../views/app/teachers/new.vue'),
            meta: {
              title: 'Nuevo docente',
            },
          },
          {
            path: ':id',
            name: 'app-teachers-detail',
            component: () => import('../views/app/teachers/detail.vue'),
            meta: {
              title: 'Detalle de docente',
            },
          },
        ],
        meta: {
          title: 'Docentes',
          requiresAuth: true,
        },
      },
      // courses
      {
        path: 'courses',
        name: 'app-courses',
        component: () => import('../views/app/courses/index.vue'),
        meta: {
          title: 'Cursos',
          requiresAuth: true,
        },
        children: [
          {
            path: '',
            name: 'app-courses-list',
            component: () => import('../views/app/courses/list.vue'),
            meta: {
              title: 'Cursos',
            },
          },
          {
            path: 'add',
            name: 'app-courses-add',
            component: () => import('../views/app/courses/add.vue'),
            meta: {
              title: 'Agregar curso',
            },
          },
          {
            path: ':id',
            name: 'app-courses-detail',
            component: () => import('../views/app/courses/detail.vue'),
            meta: {
              title: 'Detalle de curso',
            },
          },
        ],
      },
      // modules
      {
        path: 'modules',
        name: 'app-modules',
        component: () => import('../views/app/modules/index.vue'),
        meta: {
          title: 'Módulos',
          requiresAuth: true,
        },
        children: [
          {
            path: ':courseId',
            name: 'app-modules-by-course',
            component: () => import('../views/app/modules/by-course.vue'),
            meta: {
              title: 'Módulos',
            },
          },
          {
            path: 'add/:courseId',
            name: 'app-modules-add',
            component: () => import('../views/app/modules/add.vue'),
            meta: {
              title: 'Agregar módulo',
            },
          },
          {
            path: 'content/:id',
            name: 'app-modules-content',
            component: () => import('../views/app/modules/content.vue'),
            meta: {
              title: 'Contenido de módulo',
            },
          },
        ],
      },
      // lessons
      {
        path: 'lessons',
        name: 'app-lessons',
        component: () => import('../views/app/lessons/index.vue'),
        meta: {
          title: 'Lecciones',
          requiresAuth: true,
        },
        children: [
          {
            path: ':moduleId',
            name: 'app-lessons-by-module',
            component: () => import('../views/app/lessons/by-module.vue'),
            meta: {
              title: 'Lecciones',
            },
          },
          {
            path: 'add/:moduleId',
            name: 'app-lessons-add',
            component: () => import('../views/app/lessons/add.vue'),
            meta: {
              title: 'Agregar lección',
            },
          },
          {
            path: 'content/:id',
            name: 'app-lessons-content',
            component: () => import('../views/app/lessons/content.vue'),
            meta: {
              title: 'Contenido de lección',
            },
          },
        ],
      },
      // quizzes
      {
        path: 'quizzes',
        name: 'app-quizzes',
        component: () => import('../views/app/quizzes/index.vue'),
        meta: {
          title: 'Cuestionarios',
          requiresAuth: true,
        },
        children: [
          {
            path: 'add/:moduleId',
            name: 'app-quizzes-add',
            component: () => import('../views/app/quizzes/add.vue'),
            meta: {
              title: 'Agregar cuestionario',
            },
          },
        ],
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
