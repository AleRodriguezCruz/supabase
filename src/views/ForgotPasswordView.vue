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
        <h1 class="auth-title">Recuperar contraseña</h1>
        <p class="auth-subtitle">Te enviaremos un enlace a tu correo</p>
      </div>

      <div v-if="successMsg" class="alert alert--success">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
        {{ successMsg }}
      </div>

      <div v-if="errorMsg" class="alert alert--error">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0V5zm.75 7a1 1 0 110-2 1 1 0 010 2z"/>
        </svg>
        {{ errorMsg }}
      </div>

      <form v-if="!successMsg" @submit.prevent="handleForgot" novalidate>

        <div class="field" :class="{ 'field--error': errors.email }">
          <label for="email" class="field-label">Correo electrónico</label>
          <input id="email" v-model.trim="email" type="email" class="field-input"
            placeholder="tu@correo.com" autocomplete="email" @blur="validateEmail"/>
          <span v-if="errors.email" class="field-msg">{{ errors.email }}</span>
        </div>

        <button type="submit" class="btn-primary" :disabled="isLoading">
          <span v-if="!isLoading">Enviar enlace</span>
          <span v-else class="spinner"></span>
        </button>

      </form>

      <p class="auth-footer">
        <RouterLink to="/login">← Volver al inicio de sesión</RouterLink>
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { supabase } from '@/lib/supabase'

const email      = ref('')
const errors     = reactive({ email: '' })
const isLoading  = ref(false)
const errorMsg   = ref('')
const successMsg = ref('')

function validateEmail() {
  if (!email.value) errors.email = 'El correo es obligatorio.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) errors.email = 'Ingresa un correo válido.'
  else errors.email = ''
}

async function handleForgot() {
  errorMsg.value = successMsg.value = ''
  validateEmail()
  if (errors.email) return
  isLoading.value = true
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
    successMsg.value = '¡Correo enviado! Revisa tu bandeja de entrada y haz clic en el enlace.'
  } catch (err) {
    errorMsg.value = err.message || 'Error al enviar el correo.'
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

.alert { display: flex; align-items: flex-start; gap: 0.5rem; padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: 0.875rem; font-weight: 500; margin-bottom: 1.25rem; }
.alert--error   { background: var(--red-50);   color: var(--red-500);   border: 1px solid #fecdd3; }
.alert--success { background: var(--green-50); color: var(--green-500); border: 1px solid #bbf7d0; }

form { display: flex; flex-direction: column; gap: 1rem; }
.field { display: flex; flex-direction: column; gap: 0.375rem; }
.field-label { font-size: 0.8125rem; font-weight: 600; color: var(--gray-700); }

.field-input {
  width: 100%; height: 40px; padding: 0 0.875rem;
  background: var(--white); border: 1.5px solid var(--gray-200);
  border-radius: var(--radius-md); font-size: 0.9375rem; color: var(--gray-900);
  transition: border-color var(--transition), box-shadow var(--transition); outline: none;
}
.field-input::placeholder { color: var(--gray-300); }
.field-input:focus { border-color: var(--blue-500); box-shadow: var(--shadow-focus); }
.field--error .field-input { border-color: var(--red-500); }
.field-msg { font-size: 0.8125rem; color: var(--red-500); }

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
.auth-footer a { font-weight: 600; color: var(--blue-500); }
</style>