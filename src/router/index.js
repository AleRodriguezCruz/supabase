import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabase'


const HomeView = () => import('@/views/HomeView.vue')
const LoginView = () => import('@/views/LoginView.vue')
const DashboardView = () => import('@/views/DashboardView.vue')
const NotFoundView = () => import('@/views/NotFoundView.vue')
const RegisterView = () => import('@/views/RegisterView.vue')
const ForgotPasswordView = () => import('@/views/ForgotPasswordView.vue')
const ResetPasswordView = () => import('@/views/ResetPasswordView.vue')

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
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPasswordView,
    meta: { title: 'Recuperar contraseña', requiresAuth: false, guestOnly: true },
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPasswordView,
    // requiresAuth false porque entramos con la sesión temporal del correo
    meta: { title: 'Nueva contraseña', requiresAuth: false },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: { title: 'Página no encontrada' },
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

// NAVIGATION GUARD
router.beforeEach(async (to, from, next) => {
  // Configurar título de la página
  document.title = `${to.meta.title ?? 'App'} | VueAuth`

  // Obtener sesión actual
  const { data } = await supabase.auth.getSession()
  const isAuthenticated = !!data.session

  // 1. Si la ruta requiere auth y no está logueado -> Al Login
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } 
  // 2. Si la ruta es solo para invitados (Login/Register) y YA está logueado
  else if (to.meta.guestOnly && isAuthenticated) {
    //Si acaba de cambiar contraseña, el signOut() lo hará fallar aquí 
    // y lo dejará entrar al login. Si no, al Dashboard.
    next({ name: 'dashboard' })
  } 
  // 3. En cualquier otro caso, permitir el paso
  else {
    next()
  }
})

export default router
