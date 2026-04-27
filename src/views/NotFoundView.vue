<template>
  <div class="notfound-page">
    <div class="notfound-card">
      <div class="notfound-code">404</div>
      <h1 class="notfound-title">Página no encontrada</h1>
      <p class="notfound-desc">La página que buscas no existe o fue movida.</p>
      <RouterLink to="/" class="btn-primary">Volver al inicio</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.notfound-page {
  min-height: calc(100vh - 60px); display: flex;
  align-items: center; justify-content: center;
  padding: 2rem; background: var(--gray-50);
}
.notfound-card { text-align: center; }
.notfound-code  { font-size: 6rem; font-weight: 800; letter-spacing: -0.05em; color: var(--gray-200); line-height: 1; }
.notfound-title { font-size: 1.5rem; font-weight: 700; color: var(--gray-900); margin: 1rem 0 0.5rem; }
.notfound-desc  { color: var(--gray-500); margin-bottom: 2rem; }
.btn-primary {
  display: inline-block; padding: 0.65rem 1.5rem;
  background: var(--blue-500); color: white; border-radius: var(--radius-md);
  font-weight: 600; font-size: 0.9375rem; text-decoration: none;
  transition: background 150ms ease;
}
.btn-primary:hover { background: var(--blue-600); text-decoration: none; }
</style>