<template>
  <div class="login-page">
    <div class="login-bg">
      <div class="bg-pattern"></div>
    </div>
    <div class="login-card card">
      <div class="login-logo">
        <div class="logo-circle">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        </div>
        <h1>Lancaster University Ghana</h1>
        <p>Library System</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div v-if="error" class="error-banner">{{ error }}</div>

        <div class="field">
          <label>Email Address</label>
          <input v-model="email" type="email" placeholder="student@lancaster.edu.gh" required />
          <span class="field-hint">Use 'librarian@...' for Librarian Dashboard or any other email for Student Dashboard</span>
        </div>

        <div class="field">
          <label>Password</label>
          <div class="password-wrapper">
            <input v-model="password" :type="showPass ? 'text' : 'password'" placeholder="Enter your password" required />
            <button type="button" class="toggle-pass" @click="showPass = !showPass">
              <svg v-if="!showPass" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </button>
          </div>
        </div>

        <button type="submit" class="btn btn-primary login-btn" :disabled="loading">
          <svg v-if="!loading" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          <span v-if="loading">Logging in…</span>
          <span v-else>Login</span>
        </button>

        <button type="button" class="btn btn-outline create-btn" @click="showCreateAccount = true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
          Create Account
        </button>
      </form>

      <p class="help-text">Need help? Contact <a href="mailto:library@lancaster.edu.gh">library@lancaster.edu.gh</a></p>
    </div>

    <!-- Create Account Modal -->
    <div v-if="showCreateAccount" class="modal-overlay" @click.self="showCreateAccount = false">
      <div class="modal card">
        <h2>Create Account</h2>
        <p class="modal-sub">Register for library access</p>
        <form @submit.prevent="showCreateAccount = false; store.addNotification('Account created! Please login.', 'success')">
          <div class="field"><label>Full Name</label><input type="text" placeholder="Your full name" required /></div>
          <div class="field"><label>Student ID</label><input type="text" placeholder="LUG/2024/XXXX" required /></div>
          <div class="field"><label>Email</label><input type="email" placeholder="student@lancaster.edu.gh" required /></div>
          <div class="field"><label>Password</label><input type="password" placeholder="Create password" required /></div>
          <div class="modal-actions">
            <button type="button" class="btn btn-outline" @click="showCreateAccount = false">Cancel</button>
            <button type="submit" class="btn btn-primary">Create Account</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../store'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const showPass = ref(false)
const showCreateAccount = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  await new Promise(r => setTimeout(r, 600))
  const ok = store.login(email.value, password.value)
  loading.value = false
  if (ok) {
    router.push('/dashboard')
  } else {
    error.value = 'Invalid credentials. Please try again.'
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  position: relative; padding: 24px;
}
.login-bg {
  position: fixed; inset: 0;
  background: linear-gradient(135deg, var(--green-dark) 0%, #0f2619 100%);
  z-index: 0;
}
.bg-pattern {
  position: absolute; inset: 0;
  background-image: radial-gradient(circle at 20% 20%, rgba(255,255,255,0.04) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(201,168,76,0.08) 0%, transparent 50%);
}
.login-card {
  position: relative; z-index: 1;
  width: 100%; max-width: 440px;
  padding: 48px 40px;
  animation: slideUp 0.4s ease;
}
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

.login-logo { text-align: center; margin-bottom: 36px; }
.logo-circle {
  width: 64px; height: 64px; border-radius: 50%;
  background: var(--green-dark);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px;
  box-shadow: 0 4px 20px rgba(26,61,43,0.3);
}
.login-logo h1 { font-size: 1.1rem; font-weight: 700; color: var(--green-dark); margin-bottom: 4px; }
.login-logo p { font-size: 0.875rem; color: var(--gray-500); }

.login-form { display: flex; flex-direction: column; gap: 20px; }

.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-size: 0.875rem; font-weight: 600; color: var(--gray-700); }
.field input {
  padding: 11px 14px; border-radius: var(--radius-sm);
  border: 1.5px solid var(--gray-200);
  font-size: 0.9rem; color: var(--gray-900);
  transition: border-color var(--transition), box-shadow var(--transition);
  outline: none; background: var(--gray-50);
}
.field input:focus { border-color: var(--green-dark); box-shadow: 0 0 0 3px rgba(26,61,43,0.1); background: white; }
.field-hint { font-size: 0.75rem; color: var(--gray-400); line-height: 1.4; }

.password-wrapper { position: relative; }
.password-wrapper input { width: 100%; padding-right: 44px; }
.toggle-pass {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  color: var(--gray-400); display: flex; align-items: center;
  transition: color var(--transition);
}
.toggle-pass:hover { color: var(--green-dark); }

.login-btn, .create-btn { width: 100%; justify-content: center; padding: 13px; }
.login-btn:disabled { opacity: 0.7; cursor: not-allowed; }

.error-banner {
  background: var(--red-light); color: var(--red);
  padding: 10px 14px; border-radius: var(--radius-sm);
  font-size: 0.875rem; font-weight: 500;
}

.help-text { text-align: center; margin-top: 24px; font-size: 0.8rem; color: var(--gray-400); }
.help-text a { color: var(--green-dark); font-weight: 500; }

.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 200; padding: 24px;
}
.modal {
  width: 100%; max-width: 420px; padding: 36px;
  animation: slideUp 0.3s ease;
}
.modal h2 { margin-bottom: 4px; font-size: 1.4rem; }
.modal-sub { color: var(--gray-500); font-size: 0.875rem; margin-bottom: 24px; }
.modal form { display: flex; flex-direction: column; gap: 16px; }
.modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; }
</style>
