<template>
  <nav class="navbar">
    <div class="navbar-inner page-container">
      <router-link to="/dashboard" class="brand">
        <div class="brand-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        </div>
        <div class="brand-text">
          <span class="brand-name">Lancaster University Ghana</span>
          <span class="brand-sub">Library System</span>
        </div>
      </router-link>

      <div class="nav-links">
        <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
        <router-link to="/search" class="nav-link">Search Books</router-link>
        <router-link to="/loans" class="nav-link">My Loans</router-link>
        <router-link to="/reservations" class="nav-link">Reservations</router-link>
        <router-link v-if="store.currentUser?.role === 'librarian'" to="/librarian" class="nav-link nav-link--gold">Admin</router-link>
      </div>

      <div class="nav-right">
        <div class="user-pill">
          <div class="avatar">{{ store.currentUser?.initials }}</div>
          <span class="user-name">{{ store.currentUser?.name }}</span>
          <button class="logout-btn" @click="logout" title="Logout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { store } from '../store'
import { useRouter } from 'vue-router'
const router = useRouter()
function logout() { store.logout(); router.push('/login') }
</script>

<style scoped>
.navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  background: var(--white);
  border-bottom: 1px solid var(--gray-200);
  height: 72px;
  box-shadow: 0 1px 12px rgba(0,0,0,0.06);
}
.navbar-inner {
  height: 72px;
  display: flex; align-items: center; gap: 32px;
}
.brand { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.brand-icon {
  width: 42px; height: 42px; border-radius: 12px;
  background: var(--green-dark);
  color: white;
  display: flex; align-items: center; justify-content: center;
}
.brand-text { display: flex; flex-direction: column; }
.brand-name { font-family: 'Playfair Display', serif; font-size: 0.95rem; font-weight: 700; color: var(--green-dark); line-height: 1.2; }
.brand-sub { font-size: 0.72rem; color: var(--gray-500); font-weight: 400; }

.nav-links { display: flex; align-items: center; gap: 4px; flex: 1; }
.nav-link {
  padding: 7px 14px; border-radius: 8px;
  font-size: 0.875rem; font-weight: 500; color: var(--gray-500);
  transition: all var(--transition);
}
.nav-link:hover { color: var(--green-dark); background: var(--gray-100); }
.nav-link.router-link-active { color: var(--green-dark); background: var(--green-ok-light); font-weight: 600; }
.nav-link--gold.router-link-active { color: var(--gold); background: var(--gold-pale); }

.nav-right { margin-left: auto; }
.user-pill {
  display: flex; align-items: center; gap: 10px;
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: 40px;
  padding: 6px 14px 6px 6px;
}
.avatar {
  width: 34px; height: 34px; border-radius: 50%;
  background: var(--green-dark); color: white;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.8rem; font-weight: 700;
}
.user-name { font-size: 0.875rem; font-weight: 500; color: var(--gray-700); }
.logout-btn {
  color: var(--gray-400); display: flex; align-items: center;
  padding: 2px; border-radius: 4px; transition: color var(--transition);
}
.logout-btn:hover { color: var(--red); }
</style>
