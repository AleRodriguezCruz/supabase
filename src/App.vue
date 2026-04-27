<script setup>
import { onMounted } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const { isAuthenticated, displayName, logout } = useAuth()

async function handleLogout() {
  await logout()
  await router.push('/login')
}

// Escuchar eventos de autenticación globalmente
onMounted(() => {
  supabase.auth.onAuthStateChange((event, session) => {
    // Si el evento es recuperación de contraseña, forzamos la ruta
    if (event === 'PASSWORD_RECOVERY') {
      console.log('Modo recuperación detectado')
      router.push({ name: 'reset-password' })
    }
  })
})
</script>

<template>
  <div id="app">
    <header class="navbar">
      <div class="navbar-inner">
        <RouterLink to="/" class="navbar-brand">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="#635bff"/>
            <path d="M14 7C10.134 7 7 10.134 7 14s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zm0 11.5A4.5 4.5 0 119.5 14 4.505 4.505 0 0114 18.5z" fill="white"/>
          </svg>
          <span class="navbar-name">VueAuth</span>
        </RouterLink>

        <nav class="navbar-nav">
          <RouterLink to="/" class="nav-link">Inicio</RouterLink>
          <template v-if="isAuthenticated">
            <RouterLink to="/dashboard" class="nav-link">Dashboard</RouterLink>
            <div class="nav-divider"></div>
            <span class="nav-user">{{ displayName }}</span>
            <button class="btn-logout" @click="handleLogout">Cerrar sesión</button>
          </template>
          <template v-else>
            <RouterLink to="/login" class="nav-link">Iniciar sesión</RouterLink>
            <RouterLink to="/register" class="btn-nav-primary">Crear cuenta</RouterLink>
          </template>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
/* Tus estilos se mantienen iguales */
.navbar { position: sticky; top: 0; z-index: 100; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border-bottom: 1px solid var(--gray-200); height: 60px; }
.navbar-inner { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; height: 100%; display: flex; align-items: center; justify-content: space-between; }
.navbar-brand { display: flex; align-items: center; gap: 0.6rem; text-decoration: none; }
.navbar-name { font-size: 1rem; font-weight: 700; color: var(--gray-900); }
.navbar-nav { display: flex; align-items: center; gap: 0.25rem; }
.nav-link { padding: 0.4rem 0.75rem; font-size: 0.875rem; font-weight: 500; color: var(--gray-500); text-decoration: none; }
.nav-divider { width: 1px; height: 20px; background: var(--gray-200); margin: 0 0.5rem; }
.btn-logout { cursor: pointer; border: none; background: none; font-size: 0.875rem; color: var(--gray-500); }
.btn-nav-primary { padding: 0.45rem 1rem; font-size: 0.875rem; font-weight: 600; color: white; background: #635bff; border-radius: 6px; text-decoration: none; }
.main-content { flex: 1; }
.page-enter-active, .page-leave-active { transition: opacity 0.15s ease; }
.page-enter-from, .page-leave-to { opacity: 0; }
</style>
