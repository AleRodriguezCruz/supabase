<template>
  <div class="auth-page">
    <div class="auth-card">

      <div class="auth-header">
        <div class="auth-logo">
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="#635bff"/>
            <path d="M14 7C10.134 7 7 10.134 7 14s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zm0 11.5A4.5 4.5 0 119.5 14 4.505 4.505 0 0114 18.5z" fill="white"/>
          </svg>
        </div>
        <h1 class="auth-title">Bienvenido de nuevo</h1>
        <p class="auth-subtitle">Inicia sesión en tu cuenta</p>
      </div>

      <div v-if="errorMsg" class="alert alert--error">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0V5zm.75 7a1 1 0 110-2 1 1 0 010 2z"/>
        </svg>
        {{ errorMsg }}
      </div>

      <form @submit.prevent="handleLogin" novalidate>

        <div class="field" :class="{ 'field--error': errors.email }">
          <label for="email" class="field-label">Correo electrónico</label>
          <input id="email" v-model.trim="form.email" type="email" class="field-input"
            placeholder="tu@correo.com" autocomplete="email" @blur="validateEmail"/>
          <span v-if="errors.email" class="field-msg">{{ errors.email }}</span>
        </div>

        <div class="field" :class="{ 'field--error': errors.password }">
          <div class="field-row">
            <label for="password" class="field-label">Contraseña</label>
            <RouterLink to="/forgot-password" class="field-link">¿Olvidaste tu contraseña?</RouterLink>
          </div>
          <div class="field-input-wrap">
            <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'"
              class="field-input" placeholder="••••••••" autocomplete="current-password" @blur="validatePassword"/>
            <button type="button" class="field-eye" @click="showPassword = !showPassword">
              <svg v-if="!showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
          <span v-if="errors.password" class="field-msg">{{ errors.password }}</span>
        </div>

        <button type="submit" class="btn-primary" :disabled="isLoading">
          <span v-if="!isLoading">Iniciar sesión</span>
          <span v-else class="spinner"></span>
        </button>

      </form>

      <p class="auth-footer">
        ¿No tienes cuenta?
        <RouterLink to="/register">Crear una cuenta</RouterLink>
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route  = useRoute()
const { login } = useAuth()

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const showPassword = ref(false)
const isLoading    = ref(false)
const errorMsg     = ref('')

function validateEmail() {
  if (!form.email) errors.email = 'El correo es obligatorio.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Ingresa un correo válido.'
  else errors.email = ''
}

function validatePassword() {
  if (!form.password) errors.password = 'La contraseña es obligatoria.'
  else if (form.password.length < 6) errors.password = 'Mínimo 6 caracteres.'
  else errors.password = ''
}

function isFormValid() {
  validateEmail(); validatePassword()
  return !errors.email && !errors.password
}

async function handleLogin() {
  errorMsg.value = ''
  if (!isFormValid()) return
  isLoading.value = true
  try {
    await login(form.email, form.password)
    await router.push(route.query.redirect || '/dashboard')
  } catch (err) {
    if (err.message?.includes('Invalid login credentials')) errorMsg.value = 'Correo o contraseña incorrectos.'
    else if (err.message?.includes('Email not confirmed'))  errorMsg.value = 'Confirma tu correo antes de iniciar sesión.'
    else errorMsg.value = err.message || 'Error al iniciar sesión.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 60px);
  display: flex; align-items: center; justify-content: center;
  padding: 2rem 1rem; background: var(--gray-50);
}

.auth-card {
  width: 100%; max-width: 400px;
  background: var(--white); border: 1px solid var(--gray-200);
  border-radius: var(--radius-xl); padding: 2.5rem;
  box-shadow: var(--shadow-lg); animation: slideUp 0.25s ease both;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.auth-header { text-align: center; margin-bottom: 2rem; }
.auth-logo   { display: inline-flex; margin-bottom: 1.25rem; }
.auth-title  { font-size: 1.375rem; font-weight: 700; letter-spacing: -0.03em; color: var(--gray-900); margin-bottom: 0.25rem; }
.auth-subtitle { font-size: 0.875rem; color: var(--gray-500); }

.alert { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: 0.875rem; font-weight: 500; margin-bottom: 1.25rem; }
.alert--error { background: var(--red-50); color: var(--red-500); border: 1px solid #fecdd3; }

form { display: flex; flex-direction: column; gap: 1rem; }
.field { display: flex; flex-direction: column; gap: 0.375rem; }
.field-row { display: flex; justify-content: space-between; align-items: center; }
.field-label { font-size: 0.8125rem; font-weight: 600; color: var(--gray-700); }
.field-link  { font-size: 0.8125rem; color: var(--blue-500); font-weight: 500; }
.field-input-wrap { position: relative; }

.field-input {
  width: 100%; height: 40px; padding: 0 0.875rem;
  background: var(--white); border: 1.5px solid var(--gray-200);
  border-radius: var(--radius-md); font-size: 0.9375rem; color: var(--gray-900);
  transition: border-color var(--transition), box-shadow var(--transition); outline: none;
}
.field-input-wrap .field-input { padding-right: 2.75rem; }
.field-input::placeholder { color: var(--gray-300); }
.field-input:focus { border-color: var(--blue-500); box-shadow: var(--shadow-focus); }
.field--error .field-input { border-color: var(--red-500); }
.field-msg { font-size: 0.8125rem; color: var(--red-500); }

.field-eye {
  position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%);
  background: none; border: none; color: var(--gray-400); padding: 0.25rem;
  display: flex; align-items: center; transition: color var(--transition);
}
.field-eye:hover { color: var(--gray-700); }

.btn-primary {
  width: 100%; height: 42px; background: var(--blue-500); color: white; border: none;
  border-radius: var(--radius-md); font-size: 0.9375rem; font-weight: 600;
  transition: background var(--transition), transform var(--transition), box-shadow var(--transition);
  margin-top: 0.5rem; display: flex; align-items: center; justify-content: center;
}
.btn-primary:hover:not(:disabled) { background: var(--blue-600); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(99,91,255,0.35); }
.btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }

.spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.65s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.auth-footer { text-align: center; font-size: 0.875rem; color: var(--gray-500); margin-top: 1.5rem; }
.auth-footer a { font-weight: 600; }
</style>