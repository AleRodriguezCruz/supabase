<template>
  <div class="home-page">
    <div class="home-inner">

      <!-- Hero -->
      <div class="hero">
        <div class="hero-badge">Vue 3 + Supabase</div>
        <h1 class="hero-title">Autenticación segura<br/>para tu aplicación</h1>
        <p class="hero-desc">
          Sistema de autenticación completo con login, registro, rutas protegidas
          y recuperación de contraseña. Conectado a Supabase en tiempo real.
        </p>
        <div class="hero-actions">
          <RouterLink v-if="!isAuthenticated" to="/register" class="btn-primary">
            Crear cuenta gratis
          </RouterLink>
          <RouterLink v-else to="/dashboard" class="btn-primary">
            Ir al Dashboard →
          </RouterLink>
          <RouterLink v-if="!isAuthenticated" to="/login" class="btn-secondary">
            Iniciar sesión
          </RouterLink>
        </div>
      </div>

      <!-- Features -->
      <div class="features-grid">
        <div v-for="f in features" :key="f.title" class="feature-card">
          <div class="feature-icon">{{ f.icon }}</div>
          <h3 class="feature-title">{{ f.title }}</h3>
          <p class="feature-desc">{{ f.desc }}</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { isAuthenticated } = useAuth()

const features = [
  { icon: '🔐', title: 'Login seguro',         desc: 'Autenticación con email y contraseña usando Supabase Auth.' },
  { icon: '📝', title: 'Registro de usuarios', desc: 'Crea tu cuenta con confirmación de correo electrónico.' },
  { icon: '🛡️', title: 'Rutas protegidas',     desc: 'El dashboard solo es accesible para usuarios autenticados.' },
  { icon: '🔑', title: 'Recuperar contraseña', desc: 'Restablece tu contraseña con un enlace enviado a tu correo.' },
  { icon: '☁️', title: 'Base de datos',         desc: 'Datos almacenados en Supabase con PostgreSQL en la nube.' },
  { icon: '🚀', title: 'Desplegado en Vercel',  desc: 'Disponible en producción con deploy automático desde GitHub.' },
]
</script>

<style scoped>
.home-page { background: var(--gray-50); min-height: calc(100vh - 60px); padding: 4rem 1rem; }

.home-inner { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 4rem; }

/* Hero */
.hero { text-align: center; animation: slideUp 0.3s ease both; }

@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.hero-badge {
  display: inline-block; padding: 0.35rem 0.875rem;
  background: var(--blue-50); color: var(--blue-500);
  border: 1px solid #c7d2fe; border-radius: 99px;
  font-size: 0.8125rem; font-weight: 600; margin-bottom: 1.5rem;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800; letter-spacing: -0.04em;
  color: var(--gray-900); line-height: 1.15; margin-bottom: 1.25rem;
}

.hero-desc {
  font-size: 1.0625rem; color: var(--gray-500);
  max-width: 540px; margin: 0 auto 2rem; line-height: 1.65;
}

.hero-actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }

.btn-primary {
  padding: 0.65rem 1.5rem; background: var(--blue-500); color: white;
  border-radius: var(--radius-md); font-size: 0.9375rem; font-weight: 600;
  text-decoration: none; transition: background var(--transition), transform var(--transition), box-shadow var(--transition);
}
.btn-primary:hover { background: var(--blue-600); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(99,91,255,0.35); text-decoration: none; }

.btn-secondary {
  padding: 0.65rem 1.5rem; background: var(--white); color: var(--gray-700);
  border: 1.5px solid var(--gray-200); border-radius: var(--radius-md);
  font-size: 0.9375rem; font-weight: 600; text-decoration: none;
  transition: all var(--transition);
}
.btn-secondary:hover { border-color: var(--gray-400); text-decoration: none; }

/* Features */
.features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }

.feature-card {
  background: var(--white); border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg); padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition), transform var(--transition);
}
.feature-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }

.feature-icon  { font-size: 1.5rem; margin-bottom: 0.875rem; }
.feature-title { font-size: 0.9375rem; font-weight: 700; color: var(--gray-900); margin-bottom: 0.375rem; }
.feature-desc  { font-size: 0.875rem; color: var(--gray-500); line-height: 1.55; }

@media (max-width: 768px) {
  .features-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .features-grid { grid-template-columns: 1fr; }
}
</style>
