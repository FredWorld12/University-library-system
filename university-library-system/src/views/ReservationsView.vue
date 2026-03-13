<template>
  <div class="res-page">
    <div class="page-container">
      <div class="page-header">
        <button class="back-btn" @click="$router.back()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
        <div>
          <h1>My Reservations</h1>
          <p>Track your book reservations and queue positions</p>
        </div>
      </div>

      <div v-if="!store.reservations.length" class="empty-state card">
        <div class="empty-icon">📚</div>
        <h3>No Active Reservations</h3>
        <p>You haven't reserved any books yet. Browse our library to reserve books that are currently borrowed.</p>
        <router-link to="/search" class="btn btn-primary">Browse Library</router-link>
      </div>

      <div v-else class="reservations-list">
        <div v-for="res in enrichedReservations" :key="res.bookId" class="res-card card">
          <div class="res-cover">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          </div>
          <div class="res-details">
            <h3>{{ res.book?.title }}</h3>
            <p class="res-author">{{ res.book?.author }}</p>
            <span class="badge badge-gold">{{ res.book?.category }}</span>
          </div>
          <div class="res-queue">
            <span class="queue-label">Queue Position</span>
            <span class="queue-num">#{{ res.position }}</span>
            <span class="queue-sub">{{ res.position - 1 }} people ahead</span>
          </div>
          <div class="res-status">
            <span class="badge badge-gray">Waiting</span>
            <span class="res-date">Reserved {{ formatDate(res.date) }}</span>
          </div>
          <div class="res-actions">
            <button class="btn btn-outline btn-sm-x" @click="cancelReservation(res.bookId)">Cancel</button>
            <router-link :to="`/book/${res.bookId}`" class="btn btn-ghost-sm">View Book</router-link>
          </div>
        </div>
      </div>

      <div class="info-section card">
        <h3>How Reservations Work</h3>
        <div class="steps">
          <div class="step">
            <div class="step-num">1</div>
            <div>
              <strong>Reserve a borrowed book</strong>
              <p>When a book you want is borrowed, you can join the waiting queue.</p>
            </div>
          </div>
          <div class="step">
            <div class="step-num">2</div>
            <div>
              <strong>Wait for your turn</strong>
              <p>You'll be notified by email when the book becomes available for you.</p>
            </div>
          </div>
          <div class="step">
            <div class="step-num">3</div>
            <div>
              <strong>Collect within 48 hours</strong>
              <p>Once notified, visit the library within 48 hours to collect your reserved book.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { store } from '../store'

const enrichedReservations = computed(() =>
  store.reservations.map(r => ({
    ...r,
    book: store.books.find(b => b.id === r.bookId)
  }))
)

function cancelReservation(bookId) {
  store.reservations = store.reservations.filter(r => r.bookId !== bookId)
  store.addNotification('Reservation cancelled', 'info')
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.res-page { padding: 32px 0 48px; }
.page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.page-header h1 { font-size: 1.6rem; color: var(--green-dark); margin-bottom: 2px; }
.page-header p { color: var(--gray-500); font-size: 0.875rem; }
.back-btn { display: flex; align-items: center; gap: 6px; color: var(--gray-500); font-size: 0.875rem; font-weight: 500; padding: 8px 12px; border-radius: 8px; transition: all var(--transition); }
.back-btn:hover { background: var(--gray-100); color: var(--gray-900); }

.empty-state { padding: 64px 24px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; margin-bottom: 24px; }
.empty-icon { font-size: 3rem; }
.empty-state h3 { font-size: 1.2rem; }
.empty-state p { color: var(--gray-500); font-size: 0.875rem; max-width: 360px; line-height: 1.6; }

.reservations-list { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; }
.res-card { display: flex; align-items: center; gap: 20px; padding: 20px 24px; }
.res-cover {
  width: 56px; height: 72px; border-radius: 8px; flex-shrink: 0;
  background: linear-gradient(135deg, var(--green-dark), var(--green-light));
  display: flex; align-items: center; justify-content: center;
}
.res-details { flex: 1; }
.res-details h3 { font-size: 1rem; font-weight: 600; margin-bottom: 4px; }
.res-author { font-size: 0.82rem; color: var(--gray-500); margin-bottom: 8px; }
.res-queue { display: flex; flex-direction: column; align-items: center; gap: 2px; min-width: 80px; }
.queue-label { font-size: 0.72rem; color: var(--gray-400); text-transform: uppercase; letter-spacing: 0.04em; }
.queue-num { font-size: 1.8rem; font-weight: 700; color: var(--gold); line-height: 1; }
.queue-sub { font-size: 0.72rem; color: var(--gray-500); }
.res-status { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.res-date { font-size: 0.72rem; color: var(--gray-400); }
.res-actions { display: flex; flex-direction: column; gap: 8px; }
.btn-sm-x { padding: 7px 14px; font-size: 0.82rem; border-radius: 8px; }
.btn-ghost-sm { font-size: 0.82rem; color: var(--green-dark); font-weight: 600; padding: 7px 14px; border-radius: 8px; transition: background var(--transition); text-align: center; }
.btn-ghost-sm:hover { background: var(--green-ok-light); }

.info-section { padding: 28px 32px; }
.info-section h3 { font-size: 1.1rem; margin-bottom: 20px; }
.steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.step { display: flex; gap: 14px; }
.step-num {
  width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
  background: var(--green-dark); color: white;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 0.875rem;
}
.step strong { display: block; font-size: 0.875rem; margin-bottom: 4px; }
.step p { font-size: 0.8rem; color: var(--gray-500); line-height: 1.5; }
</style>
