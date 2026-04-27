<script setup>
import { ref, reactive } from 'vue'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoading = ref(false)
const showPassword = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const form = reactive({
  password: '',
  confirm: ''
})

const errors = reactive({
  password: '',
  confirm: ''
})

const validatePassword = () => {
  errors.password = form.password.length < 6 ? 'Mínimo 6 caracteres' : ''
  return !errors.password
}

const validateConfirm = () => {
  errors.confirm = form.password !== form.confirm ? 'Las contraseñas no coinciden' : ''
  return !errors.confirm
}

const handleReset = async () => {
  errorMsg.value = ''
  if (!validatePassword() || !validateConfirm()) return

  isLoading.value = true

  try {
    const { error } = await supabase.auth.updateUser({
      password: form.password
    })

    if (error) throw error

    successMsg.value = '¡Contraseña actualizada! Redirigiendo al inicio de sesión...'
    
    //  Cerramos la sesión temporal para obligar un login limpio
    await supabase.auth.signOut()

    setTimeout(() => {
      // Usamos la ruta del login
      router.push('/login')
    }, 2000)

  } catch (err) {
    errorMsg.value = err.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <h1 class="auth-title">Nueva contraseña</h1>
        <p class="auth-subtitle">Elige una clave que no hayas usado antes</p>
      </div>

      <div v-if="successMsg" class="alert alert--success">{{ successMsg }}</div>
      <div v-if="errorMsg" class="alert alert--error">{{ errorMsg }}</div>

      <form v-if="!successMsg" @submit.prevent="handleReset">
        <div class="field">
          <label class="field-label">Contraseña nueva</label>
          <div class="input-container">
            <input 
              v-model="form.password" 
              :type="showPassword ? 'text' : 'password'" 
              class="field-input"
              placeholder="Mínimo 6 caracteres"
              @blur="validatePassword"
            />
            <button type="button" class="eye-btn" @click="showPassword = !showPassword">
              {{ showPassword ? '👁️' : '🕶️' }}
            </button>
          </div>
          <span v-if="errors.password" class="field-msg">{{ errors.password }}</span>
        </div>

        <div class="field">
          <label class="field-label">Confirmar contraseña</label>
          <input 
            v-model="form.confirm" 
            type="password" 
            class="field-input"
            placeholder="Repite tu contraseña"
            @blur="validateConfirm"
          />
          <span v-if="errors.confirm" class="field-msg">{{ errors.confirm }}</span>
        </div>

        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Guardando...' : 'Actualizar Contraseña' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px);
  padding: 20px;
  background-color: #f9fafb;
}

.auth-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 400px;
}

.auth-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.auth-subtitle {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 24px;
}

.field {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.field-label {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #374151;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.field-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
}

.eye-btn {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background-color: #635bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background-color: #5348e6;
}

.btn-primary:disabled {
  background-color: #a5a2f5;
  cursor: not-allowed;
}

.alert {
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
}

.alert--error { background: #fee2e2; color: #b91c1c; }
.alert--success { background: #dcfce7; color: #15803d; }
.field-msg { color: #b91c1c; font-size: 12px; margin-top: 4px; }
</style>
