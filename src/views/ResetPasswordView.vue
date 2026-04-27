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
        <h1 class="auth-title">Nueva contraseña</h1>
        <p class="auth-subtitle">Elige una contraseña segura</p>
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

      <form v-if="!successMsg" @submit.prevent="handleReset" novalidate>

        <div class="field" :class="{ 'field--error': errors.password }">
          <label for="password" class="field-label">Nueva contraseña</label>
          <div class="field-input-wrap">
            <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'"
              class="field-input" placeholder="Mínimo 6 caracteres" @blur="validatePassword"/>
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

        <div class="field" :class="{ 'field--error': errors.confirm }">
          <label for="confirm" class="field-label">Confirmar contraseña</label>
          <input id="confirm" v-model="form.confirm" type="password" class="field-input"
            placeholder="Repite tu contraseña" @blur="validateConfirm"/>
          <span v-if="errors.confirm" class="field-msg">{{ errors.confirm }}</span>
        </div>

        <button type="submit" class="btn-primary" :disabled="isLoading">
          <span v-if="!isLoading">Guardar contraseña</span>
          <span v-else class="spinner"></span>
        </button>

      </form>

    </div>
  </div>
</template>