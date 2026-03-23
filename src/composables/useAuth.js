// src/composables/useAuth.js
// ─────────────────────────────────────────────────────────────
//  Autenticación real con Supabase Auth
//  Reemplaza la implementación en memoria del template original
// ─────────────────────────────────────────────────────────────
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

// Estado global compartido entre todos los componentes
const _session = ref(null)
const _user    = ref(null)
const _loading = ref(true)

// Inicializar: recuperar sesión existente y escuchar cambios
;(async () => {
  const { data } = await supabase.auth.getSession()
  _session.value = data.session
  _user.value    = data.session?.user ?? null
  _loading.value = false

  // Listener para cambios de sesión (login, logout, refresh de token)
  supabase.auth.onAuthStateChange((_event, session) => {
    _session.value = session
    _user.value    = session?.user ?? null
  })
})()

export function useAuth() {
  const isAuthenticated = computed(() => !!_session.value)
  const user            = computed(() => _user.value)
  const loading         = computed(() => _loading.value)

  // ── Login con email + password ──
  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  // ── Registro de nuevo usuario ──
  async function register(email, password, name) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },          // guarda el nombre en user_metadata
      },
    })
    if (error) throw error
    return data
  }

  // ── Logout ──
  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // ── Nombre visible del usuario ──
  const displayName = computed(
    () => _user.value?.user_metadata?.name
       || _user.value?.email?.split('@')[0]
       || 'Usuario'
  )

  return {
    user,
    displayName,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  }
}
