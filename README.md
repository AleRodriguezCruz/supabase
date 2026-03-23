# VueAuth + Supabase

Proyecto Vue 3 con autenticación real usando **Supabase Auth**. Rutas protegidas, login, registro y sesión persistente.

## Stack

- Vue 3 + Composition API
- Vite 7 / Vue Router 5 / Pinia
- Supabase JS v2


## Configuración rápida

### 1. Instalar dependencias
```bash
npm install
```

### 2. Variables de entorno
```bash
cp .env.example .env
```
Edita `.env`:
```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```
> Encuéntralos en Supabase: **Settings → API**

### 3. Habilitar Email Auth en Supabase
- **Authentication → Providers → Email** → activar
- (Dev) Desactiva "Confirm email" si no quieres validación por correo

### 4. Correr
```bash
npm run dev
```

## Rutas

| Ruta | Descripción | Protegida |
|------|-------------|-----------|
| `/` | Inicio | No |
| `/login` | Iniciar sesión | Solo invitados |
| `/register` | Crear cuenta | Solo invitados |
| `/dashboard` | Panel de control | ✅ Sí |

## Estructura relevante

```
src/
├── lib/supabase.js          ← cliente Supabase (usa variables .env)
├── composables/useAuth.js   ← login, register, logout, sesión reactiva
├── router/index.js          ← navigation guards con supabase.auth.getSession()
└── views/
    ├── LoginView.vue
    ├── RegisterView.vue
    └── DashboardView.vue
```
