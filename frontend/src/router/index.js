import Vue from 'vue';
import Router from 'vue-router';
import Login from '../components/Login.vue';
import UserList from '../components/UserList.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login' // 默认重定向到登录页
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/user-list',
      name: 'UserList',
      component: UserList,
      meta: { requiresAuth: true }
    }
  ]
});

// 导航守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
