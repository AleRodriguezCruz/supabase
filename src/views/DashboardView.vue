<template>
  <div class="dashboard-page">
    <div class="dashboard-inner">

      <!-- Header -->
      <div class="dash-header">
        <div>
          <h1 class="dash-title">Dashboard</h1>
          <p class="dash-subtitle">{{ currentDate }}</p>
        </div>
        <button class="btn-logout" @click="handleLogout">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          Cerrar sesión
        </button>
      </div>

      <!-- Bienvenida -->
      <div class="welcome-card">
        <div class="welcome-avatar">{{ initials }}</div>
        <div>
          <h2 class="welcome-name">Hola, {{ displayName }} 👋</h2>
          <p class="welcome-email">{{ user?.email }}</p>
        </div>
        <div class="badge-active">● Sesión activa</div>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div v-for="stat in stats" :key="stat.label" class="stat-card">
          <div class="stat-icon">{{ stat.icon }}</div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-trend" :class="stat.trend > 0 ? 'trend--up' : 'trend--down'">
            {{ stat.trend > 0 ? '↑' : '↓' }} {{ Math.abs(stat.trend) }}%
          </div>
        </div>
      </div>

      <!-- Info + Actividad -->
      <div class="bottom-grid">

        <div class="info-card">
          <h3 class="card-title">Información de sesión</h3>
          <div class="info-list">
            <div class="info-row">
              <span class="info-key">Usuario</span>
              <span class="info-val">{{ displayName }}</span>
            </div>
            <div class="info-row">
              <span class="info-key">Email</span>
              <span class="info-val">{{ user?.email }}</span>
            </div>
            <div class="info-row">
              <span class="info-key">ID</span>
              <span class="info-val info-mono">{{ user?.id?.slice(0, 18) }}…</span>
            </div>
            <div class="info-row">
              <span class="info-key">Estado</span>
              <span class="info-val info-green">Autenticado</span>
            </div>
          </div>
        </div>

        <div class="activity-card">
          <h3 class="card-title">Actividad reciente</h3>
          <div class="activity-list">
            <div v-for="item in activity" :key="item.msg" class="activity-row">
              <span class="activity-dot" :class="`dot--${item.type}`"></span>
              <div class="activity-info">
                <span class="activity-msg">{{ item.msg }}</span>
                <span class="activity-time">{{ item.time }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { user, displayName, logout } = useAuth()

const currentDate = computed(() =>
  new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
)

const initials = computed(() => {
  const name = displayName.value || ''
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || '?'
})

const stats = [
  { icon: '📦', label: 'Proyectos',   value: '12',  trend: +8  },
  { icon: '✅', label: 'Tareas',      value: '48',  trend: +15 },
  { icon: '👥', label: 'Usuarios',    value: '7',   trend: -2  },
  { icon: '📈', label: 'Rendimiento', value: '94%', trend: +3  },
]

const activity = [
  { type: 'success', msg: 'Inicio de sesión exitoso',   time: 'Ahora mismo'   },
  { type: 'info',    msg: 'Perfil actualizado',          time: 'Hace 2 horas'  },
  { type: 'warning', msg: 'Acceso denegado (intento)',   time: 'Ayer, 11:30pm' },
  { type: 'success', msg: 'Nueva tarea completada',      time: 'Hace 2 días'   },
  { type: 'info',    msg: 'Reporte mensual generado',    time: 'Hace 3 días'   },
]

async function handleLogout() {
  await logout()
  await router.push('/login')
}
</script>

<style scoped>
.dashboard-page { background: var(--gray-50); min-height: calc(100vh - 60px); padding: 2rem 1rem; }
.dashboard-inner { max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }

.dash-header { display: flex; justify-content: space-between; align-items: flex-start; }
.dash-title  { font-size: 1.5rem; font-weight: 700; letter-spacing: -0.03em; color: var(--gray-900); }
.dash-subtitle { font-size: 0.875rem; color: var(--gray-500); text-transform: capitalize; margin-top: 0.125rem; }

.btn-logout {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 1rem; font-size: 0.875rem; font-weight: 500;
  color: var(--gray-500); background: var(--white);
  border: 1px solid var(--gray-200); border-radius: var(--radius-md);
  transition: all var(--transition);
}
.btn-logout:hover { color: var(--red-500); border-color: var(--red-500); background: var(--red-50); }

.welcome-card {
  background: var(--white); border: 1px solid var(--gray-200);
  border-radius: var(--radius-xl); padding: 1.5rem 2rem;
  display: flex; align-items: center; gap: 1.25rem;
  box-shadow: var(--shadow-sm);
}

.welcome-avatar {
  width: 52px; height: 52px; background: var(--blue-500); color: white;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 1.125rem; font-weight: 700; flex-shrink: 0;
}

.welcome-name  { font-size: 1.125rem; font-weight: 700; color: var(--gray-900); }
.welcome-email { font-size: 0.875rem; color: var(--gray-500); margin-top: 0.125rem; }

.badge-active {
  margin-left: auto; font-size: 0.8125rem; font-weight: 600;
  color: var(--green-500); background: var(--green-50);
  border: 1px solid #bbf7d0; border-radius: 99px; padding: 0.35rem 0.75rem;
}

.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }

.stat-card {
  background: var(--white); border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg); padding: 1.25rem 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition), transform var(--transition);
}
.stat-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }

.stat-icon  { font-size: 1.375rem; margin-bottom: 0.75rem; }
.stat-value { font-size: 1.75rem; font-weight: 700; letter-spacing: -0.03em; color: var(--gray-900); }
.stat-label { font-size: 0.8125rem; color: var(--gray-500); margin-top: 0.125rem; }
.stat-trend { font-size: 0.8125rem; font-weight: 600; margin-top: 0.5rem; }
.trend--up   { color: var(--green-500); }
.trend--down { color: var(--red-500); }

.bottom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

.info-card, .activity-card {
  background: var(--white); border: 1px solid var(--gray-200);
  border-radius: var(--radius-xl); padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.card-title { font-size: 0.9375rem; font-weight: 700; color: var(--gray-900); margin-bottom: 1.25rem; }

.info-list { display: flex; flex-direction: column; }
.info-row  { display: flex; justify-content: space-between; align-items: center; padding: 0.625rem 0; border-bottom: 1px solid var(--gray-100); }
.info-row:last-child { border-bottom: none; }
.info-key  { font-size: 0.8125rem; color: var(--gray-500); font-weight: 500; }
.info-val  { font-size: 0.8125rem; color: var(--gray-900); font-weight: 600; }
.info-mono { font-family: monospace; font-size: 0.75rem; }
.info-green { color: var(--green-500); }

.activity-list { display: flex; flex-direction: column; gap: 0.875rem; }
.activity-row  { display: flex; align-items: flex-start; gap: 0.75rem; }

.activity-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 0.3rem; flex-shrink: 0; }
.dot--success { background: var(--green-500); }
.dot--info    { background: var(--blue-500); }
.dot--warning { background: #f59e0b; }

.activity-info { display: flex; flex-direction: column; gap: 0.125rem; }
.activity-msg  { font-size: 0.875rem; color: var(--gray-700); font-weight: 500; }
.activity-time { font-size: 0.8125rem; color: var(--gray-400); }

@media (max-width: 768px) {
  .stats-grid  { grid-template-columns: repeat(2, 1fr); }
  .bottom-grid { grid-template-columns: 1fr; }
  .welcome-card { flex-wrap: wrap; }
  .badge-active { margin-left: 0; }
}
</style>