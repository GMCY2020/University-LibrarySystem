import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/PageLogin.vue')
    },
    {
      path: '/',
      component: () => import('@/views/LayoutContainer.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: () => import('@/views/PageHome.vue')
        },
        {
          path: '/books/brrow',
          component: () => import('@/views/BooksBrrow.vue')
        },
        {
          path: '/books/return',
          component: () => import('@/views/BooksReturn.vue')
        },
        {
          path: '/admin/booksedit',
          component: () => import('@/views/BooksEdit.vue')
        },
        {
          path: '/admin/useredit',
          component: () => import('@/views/UserEdit.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to) => {
  const userStore = useUserStore()
  if (!userStore.isLogin && to.path !== '/login' && to.path != '/home')
    return '/login'
})

export default router
