// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabase'

const HomeView      = () => import('@/views/HomeView.vue')
const LoginView     = () => import('@/views/LoginView.vue')
const DashboardView = () => import('@/views/DashboardView.vue')
const NotFoundView  = () => import('@/views/NotFoundView.vue')
const RegisterView  = () => import('@/views/RegisterView.vue')
const ForgotPasswordView = () => import('@/views/ForgotPasswordView.vue')
const ResetPasswordView  = () => import('@/views/ResetPasswordView.vue')


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Inicio', requiresAuth: false },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { title: 'Iniciar sesión', requiresAuth: false, guestOnly: true },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { title: 'Crear cuenta', requiresAuth: false, guestOnly: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { title: 'Dashboard', requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: { title: 'Página no encontrada' },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPasswordView,
    meta: { title: 'Recuperar contraseña', requiresAuth: false, guestOnly: true },
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPasswordView,
    meta: { title: 'Nueva contraseña', requiresAuth: false },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  },
})

// NAVIGATION GUARD con Supabase Auth
router.beforeEach(async (to) => {
  document.title = `${to.meta.title ?? 'App'} | VueAuth`

  const { data } = await supabase.auth.getSession()
  const isAuthenticated = !!data.session

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestOnly && isAuthenticated) {
    return { name: 'dashboard' }
  }

  return true
})

export default router
