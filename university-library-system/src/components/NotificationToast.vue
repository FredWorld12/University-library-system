<template>
  <div class="toast-container">
    <transition-group name="toast">
      <div v-for="n in store.notifications" :key="n.id" :class="['toast', `toast--${n.type}`]">
        <span class="toast-icon">
          <svg v-if="n.type==='success'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </span>
        {{ n.message }}
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { store } from '../store'
</script>

<style scoped>
.toast-container {
  position: fixed; bottom: 24px; right: 24px; z-index: 9999;
  display: flex; flex-direction: column; gap: 10px; align-items: flex-end;
}
.toast {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 18px; border-radius: 10px;
  font-size: 0.875rem; font-weight: 500;
  box-shadow: var(--shadow-md); max-width: 320px;
}
.toast--success { background: var(--green-dark); color: white; }
.toast--info { background: var(--green-mid); color: white; }
.toast--error { background: var(--red); color: white; }
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateX(30px); }
.toast-leave-to { opacity: 0; transform: translateX(30px); }
</style>
