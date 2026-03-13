<template>
  <div class="book-card" @click="$router.push(`/book/${book.id}`)">
    <div class="book-cover">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
      <div class="book-cover-shine"></div>
    </div>
    <div class="book-info">
      <div class="book-category badge badge-gold">{{ book.category }}</div>
      <h3 class="book-title">{{ book.title }}</h3>
      <p class="book-author">{{ book.author }}</p>
      <p class="book-isbn">ISBN: {{ book.isbn }}</p>
      <div class="book-footer">
        <span :class="['badge', statusBadge]">{{ statusLabel }}</span>
        <div class="book-actions" @click.stop>
          <button v-if="book.status === 'available'" class="btn btn-primary btn-sm" @click="borrow">Borrow</button>
          <button v-if="book.status !== 'available'" class="btn btn-outline btn-sm" @click="reserve">Reserve</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { store } from '../store'

const props = defineProps({ book: Object })

const statusBadge = computed(() => ({
  available: 'badge-green',
  borrowed: 'badge-red',
  overdue: 'badge-red',
  reserved: 'badge-gray',
}[props.book.status] || 'badge-gray'))

const statusLabel = computed(() => props.book.status.charAt(0).toUpperCase() + props.book.status.slice(1))

function borrow() { store.borrowBook(props.book.id) }
function reserve() { store.reserveBook(props.book.id) }
</script>

<style scoped>
.book-card {
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex; flex-direction: column;
}
.book-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }

.book-cover {
  background: linear-gradient(135deg, var(--green-dark) 0%, var(--green-light) 100%);
  height: 160px;
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
}
.book-cover-shine {
  position: absolute; top: -40%; left: -40%;
  width: 80%; height: 80%;
  background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
  pointer-events: none;
}

.book-info { padding: 16px; flex: 1; display: flex; flex-direction: column; gap: 6px; }
.book-category { align-self: flex-start; font-size: 0.7rem; }
.book-title { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 600; color: var(--gray-900); line-height: 1.35; }
.book-author { font-size: 0.82rem; color: var(--gray-500); }
.book-isbn { font-size: 0.75rem; color: var(--gray-400); font-family: monospace; }
.book-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 12px; }
.book-actions { display: flex; gap: 8px; }
.btn-sm { padding: 6px 14px; font-size: 0.8rem; border-radius: 8px; }
</style>
