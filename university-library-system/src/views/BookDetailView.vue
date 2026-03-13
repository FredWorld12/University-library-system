<template>
  <div class="detail-page">
    <div class="page-container">
      <div class="detail-header">
        <button class="back-btn" @click="$router.push('/search')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back to Search
        </button>
        <div>
          <h1>Book Details</h1>
          <p>View book information</p>
        </div>
      </div>

      <div v-if="!book" class="not-found card">Book not found.</div>

      <div v-else>
        <div class="detail-card card">
          <div class="book-cover-lg">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          </div>
          <div class="detail-content">
            <h2 class="book-title">{{ book.title }}</h2>
            <span class="badge badge-gold">{{ book.category }}</span>
            <div class="meta-grid">
              <div class="meta-block">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <div><span class="meta-l">Author</span><span class="meta-v">{{ book.author }}</span></div>
              </div>
              <div class="meta-block">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                <div><span class="meta-l">ISBN</span><span class="meta-v mono">{{ book.isbn }}</span></div>
              </div>
              <div class="meta-block">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                <div><span class="meta-l">Category</span><span class="meta-v">{{ book.category }}</span></div>
              </div>
              <div class="meta-block">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <div><span class="meta-l">Status</span><span :class="['meta-v', book.status === 'available' ? 'text-green' : 'text-red']">{{ book.status.charAt(0).toUpperCase() + book.status.slice(1) }}</span></div>
              </div>
            </div>

            <div class="description">
              <h3>Description</h3>
              <p>{{ book.description }}</p>
            </div>

            <div v-if="book.status !== 'available'" class="status-alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <div>
                <strong>Currently {{ book.status }}</strong>
                <span>Available for reservation</span>
              </div>
            </div>

            <div class="action-row">
              <button v-if="book.status === 'available'" class="btn btn-primary" @click="borrow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                Borrow This Book
              </button>
              <button v-else class="btn btn-gold" @click="reserve">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Reserve This Book
              </button>
              <button class="btn btn-outline" @click="$router.push('/search')">Cancel</button>
            </div>
          </div>
        </div>

        <!-- Reservation Success -->
        <div v-if="reserved" class="reservation-success card">
          <div class="res-check">✓</div>
          <div class="res-icon">🎟️</div>
          <h2 class="text-gold">Reservation Successful!</h2>
          <p>Your reservation has been confirmed</p>
          <div class="res-info">
            <div><span class="meta-l">Book Title</span><strong>{{ book.title }}</strong></div>
            <div class="res-divider"></div>
            <div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span class="meta-l">Queue Position</span>
              <strong class="queue">#3</strong>
              <span class="queue-sub">2 people ahead of you</span>
            </div>
          </div>
          <div class="notify-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green-dark)" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <div>
              <strong>We'll Notify You</strong>
              <p>You will receive an email notification when the book becomes available. You will have 48 hours to collect it.</p>
            </div>
          </div>
          <router-link to="/dashboard" class="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            Return to Dashboard
          </router-link>
          <div class="policy">
            <strong>Reservation Policy:</strong> Reservations are valid for 48 hours once the book becomes available. If not collected within this time, the reservation will be passed to the next person in queue.
          </div>
        </div>

        <!-- Borrowing Info -->
        <div class="borrowing-info card">
          <h3>Borrowing Information</h3>
          <div class="borrow-grid">
            <div class="borrow-item">
              <span class="meta-l">Loan Period</span>
              <strong>14 days</strong>
            </div>
            <div class="borrow-item">
              <span class="meta-l">Renewal Limit</span>
              <strong>2 times</strong>
            </div>
            <div class="borrow-item">
              <span class="meta-l">Late Fee</span>
              <strong>GH₵1.00 per day</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { store } from '../store'

const route = useRoute()
const reserved = ref(false)
const book = computed(() => store.books.find(b => b.id === parseInt(route.params.id)))

function borrow() { store.borrowBook(book.value.id) }
function reserve() { store.reserveBook(book.value.id); reserved.value = true }
</script>

<style scoped>
.detail-page { padding: 32px 0 48px; }
.detail-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.detail-header h1 { font-size: 1.5rem; color: var(--green-dark); margin-bottom: 2px; }
.detail-header p { color: var(--gray-500); font-size: 0.875rem; }
.back-btn { display: flex; align-items: center; gap: 6px; color: var(--gray-500); font-size: 0.875rem; font-weight: 500; padding: 8px 12px; border-radius: 8px; transition: all var(--transition); }
.back-btn:hover { background: var(--gray-100); color: var(--gray-900); }

.detail-card { display: flex; gap: 32px; padding: 32px; margin-bottom: 20px; }
.book-cover-lg {
  width: 220px; min-height: 280px; border-radius: 16px; flex-shrink: 0;
  background: linear-gradient(160deg, var(--green-dark) 0%, var(--green-light) 100%);
  display: flex; align-items: center; justify-content: center;
}
.detail-content { flex: 1; display: flex; flex-direction: column; gap: 16px; }
.book-title { font-size: 1.6rem; color: var(--gray-900); }

.meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.meta-block {
  display: flex; align-items: flex-start; gap: 10px;
  background: var(--gray-50); border-radius: var(--radius-sm);
  padding: 12px 14px; border: 1px solid var(--gray-100);
}
.meta-block > div { display: flex; flex-direction: column; gap: 2px; }
.meta-l { font-size: 0.72rem; color: var(--gray-400); font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
.meta-v { font-size: 0.9rem; font-weight: 600; color: var(--gray-900); }
.mono { font-family: monospace; }
.text-green { color: var(--green-ok); }
.text-red { color: var(--red); }
.text-gold { color: var(--gold); }

.description h3 { font-size: 1rem; color: var(--gray-900); margin-bottom: 6px; }
.description p { font-size: 0.875rem; color: var(--gray-500); line-height: 1.6; }

.status-alert {
  display: flex; align-items: center; gap: 12px;
  background: var(--red-light); border-radius: var(--radius-sm); padding: 12px 16px;
  color: var(--red); font-size: 0.875rem;
}
.status-alert > div { display: flex; flex-direction: column; gap: 2px; }
.status-alert strong { font-weight: 600; }

.action-row { display: flex; gap: 12px; }

.reservation-success {
  text-align: center; padding: 48px 40px; margin-bottom: 20px;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  animation: slideUp 0.4s ease;
}
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.res-check { font-size: 2.5rem; }
.res-icon { font-size: 2.5rem; }
.reservation-success h2 { font-size: 1.6rem; }
.reservation-success > p { color: var(--gray-500); }
.res-info { background: var(--gray-50); border-radius: var(--radius); padding: 24px; width: 100%; max-width: 360px; display: flex; flex-direction: column; gap: 12px; }
.res-info > div { display: flex; flex-direction: column; gap: 4px; align-items: center; }
.res-divider { height: 1px; background: var(--gray-200); }
.queue { font-size: 2rem; font-weight: 700; color: var(--gray-900); }
.queue-sub { font-size: 0.8rem; color: var(--gray-500); }
.notify-box { display: flex; align-items: flex-start; gap: 12px; background: #eff6ff; border-radius: var(--radius); padding: 16px 20px; max-width: 400px; text-align: left; }
.notify-box strong { display: block; font-size: 0.9rem; margin-bottom: 4px; color: var(--green-dark); }
.notify-box p { font-size: 0.8rem; color: #1d4ed8; line-height: 1.5; }
.policy { font-size: 0.78rem; color: var(--gray-400); max-width: 420px; text-align: left; line-height: 1.5; }

.borrowing-info { padding: 24px 28px; }
.borrowing-info h3 { font-size: 1.1rem; margin-bottom: 16px; }
.borrow-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.borrow-item { display: flex; flex-direction: column; gap: 4px; }
.borrow-item strong { font-size: 1rem; color: var(--gray-900); }
.not-found { padding: 48px; text-align: center; color: var(--gray-500); }
</style>
