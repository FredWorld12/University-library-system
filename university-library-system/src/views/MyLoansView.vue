<template>
  <div class="loans-page">
    <div class="page-container">
      <div class="page-header">
        <button class="back-btn" @click="$router.back()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
        <div>
          <h1>My Loans</h1>
          <p>Track your borrowed books and due dates</p>
        </div>
      </div>

      <div class="summary-cards">
        <div class="summary-card card">
          <p class="sc-label">Active Loans</p>
          <p class="sc-val">{{ activeLoans.length }}</p>
        </div>
        <div class="summary-card card">
          <p class="sc-label">Overdue</p>
          <p class="sc-val text-red">{{ overdueLoans.length }}</p>
        </div>
        <div class="summary-card card">
          <p class="sc-label">Total Fines</p>
          <p class="sc-val text-red">GH₵{{ totalFines.toFixed(2) }}</p>
        </div>
      </div>

      <div v-if="overdueLoans.length" class="fine-notice card">
        <h3>⚠️ Outstanding Fines</h3>
        <p>You have overdue books with fines accumulating at GH₵1.00 per day. Please return or renew these books immediately.</p>
        <button class="btn btn-primary" @click="renewAll">Renew All Overdue</button>
      </div>

      <div class="section">
        <div class="section-header">
          <h2>All Borrowed Books</h2>
          <div class="header-tabs">
            <button :class="['tab', filter === 'all' ? 'tab--active' : '']" @click="filter = 'all'">All ({{ loans.length }})</button>
            <button :class="['tab', filter === 'active' ? 'tab--active' : '']" @click="filter = 'active'">Active</button>
            <button :class="['tab', filter === 'overdue' ? 'tab--active' : '']" @click="filter = 'overdue'">Overdue</button>
          </div>
        </div>

        <div v-if="!displayedLoans.length" class="empty-state card">
          <p>No {{ filter !== 'all' ? filter : '' }} loans found.</p>
        </div>

        <div v-else class="loans-table card">
          <div class="table-header">
            <span>Book</span><span>Due Date</span><span>Status</span><span>Fine</span><span>Actions</span>
          </div>
          <div v-for="book in displayedLoans" :key="book.id" :class="['table-row', book.status === 'overdue' ? 'row--overdue' : '']">
            <div class="book-cell">
              <div class="book-thumb">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              </div>
              <div>
                <p class="book-title-cell">{{ book.title }}</p>
                <p class="book-author-cell">{{ book.author }}</p>
              </div>
            </div>
            <div class="due-cell">
              <span :class="['due-date', book.status === 'overdue' ? 'text-red' : '']">{{ formatDate(book.dueDate) }}</span>
              <span v-if="book.status === 'overdue'" class="days-overdue">{{ daysOverdue(book.dueDate) }} days overdue</span>
            </div>
            <div>
              <span :class="['badge', book.status === 'overdue' ? 'badge-red' : 'badge-green']">
                {{ book.status === 'overdue' ? 'Overdue' : 'Active' }}
              </span>
            </div>
            <div>
              <span v-if="book.fine" class="fine-amount">GH₵{{ book.fine.toFixed(2) }}</span>
              <span v-else class="text-gray">—</span>
            </div>
            <div class="action-cell">
              <button class="btn btn-outline btn-xs" @click="store.renewBook(book.id)">Renew</button>
              <router-link :to="`/book/${book.id}`" class="btn btn-xs btn-ghost">Details</router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- History section -->
      <div class="section">
        <div class="section-header"><h2>Borrowing Tips</h2></div>
        <div class="tips card">
          <div class="tip">
            <div class="tip-icon">📅</div>
            <div>
              <strong>Return on time</strong>
              <p>Avoid fines by returning books before the due date. Set a reminder 3 days in advance.</p>
            </div>
          </div>
          <div class="tip">
            <div class="tip-icon">🔄</div>
            <div>
              <strong>Renew up to 2 times</strong>
              <p>You can renew each book up to 2 times as long as no one else has reserved it.</p>
            </div>
          </div>
          <div class="tip">
            <div class="tip-icon">📱</div>
            <div>
              <strong>Email notifications</strong>
              <p>You'll receive email reminders 3 days before your book is due.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { store } from '../store'

const filter = ref('all')
const loans = computed(() => store.getUserLoans())
const activeLoans = computed(() => loans.value.filter(b => b.status === 'borrowed'))
const overdueLoans = computed(() => loans.value.filter(b => b.status === 'overdue'))
const totalFines = computed(() => loans.value.reduce((s, b) => s + (b.fine || 0), 0))
const displayedLoans = computed(() => {
  if (filter.value === 'active') return activeLoans.value
  if (filter.value === 'overdue') return overdueLoans.value
  return loans.value
})

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
function daysOverdue(d) {
  const diff = Date.now() - new Date(d).getTime()
  return Math.max(0, Math.floor(diff / 86400000))
}
function renewAll() {
  overdueLoans.value.forEach(b => store.renewBook(b.id))
}
</script>

<style scoped>
.loans-page { padding: 32px 0 48px; }
.page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.page-header h1 { font-size: 1.6rem; color: var(--green-dark); margin-bottom: 2px; }
.page-header p { color: var(--gray-500); font-size: 0.875rem; }
.back-btn { display: flex; align-items: center; gap: 6px; color: var(--gray-500); font-size: 0.875rem; font-weight: 500; padding: 8px 12px; border-radius: 8px; transition: all var(--transition); }
.back-btn:hover { background: var(--gray-100); color: var(--gray-900); }

.summary-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; }
.summary-card { padding: 20px 24px; }
.sc-label { font-size: 0.8rem; color: var(--gray-500); margin-bottom: 6px; font-weight: 500; }
.sc-val { font-size: 2rem; font-weight: 700; color: var(--gray-900); }
.text-red { color: var(--red); }
.text-gray { color: var(--gray-400); }

.fine-notice {
  padding: 20px 24px; margin-bottom: 24px;
  background: #fff7ed; border: 1px solid #fed7aa;
  display: flex; align-items: center; gap: 16px;
}
.fine-notice h3 { font-size: 1rem; margin-bottom: 4px; }
.fine-notice p { font-size: 0.82rem; color: var(--gray-600); }
.fine-notice > div { flex: 1; }

.section { margin-bottom: 32px; }
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.section-header h2 { font-size: 1.3rem; }
.header-tabs { display: flex; gap: 4px; background: var(--gray-100); border-radius: 8px; padding: 4px; }
.tab { padding: 6px 14px; border-radius: 6px; font-size: 0.82rem; font-weight: 500; color: var(--gray-500); transition: all var(--transition); }
.tab--active { background: white; color: var(--green-dark); font-weight: 600; box-shadow: var(--shadow); }

.loans-table { overflow: hidden; }
.table-header {
  display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  padding: 12px 20px; background: var(--gray-50);
  font-size: 0.78rem; font-weight: 600; color: var(--gray-500);
  text-transform: uppercase; letter-spacing: 0.04em;
  border-bottom: 1px solid var(--gray-200);
}
.table-row {
  display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  padding: 16px 20px; align-items: center;
  border-bottom: 1px solid var(--gray-100);
  transition: background var(--transition);
}
.table-row:last-child { border-bottom: none; }
.table-row:hover { background: var(--gray-50); }
.row--overdue { background: #fff5f5; }
.row--overdue:hover { background: #fee2e2; }

.book-cell { display: flex; align-items: center; gap: 12px; }
.book-thumb {
  width: 40px; height: 40px; border-radius: 8px; flex-shrink: 0;
  background: linear-gradient(135deg, var(--green-dark), var(--green-light));
  display: flex; align-items: center; justify-content: center;
}
.book-title-cell { font-weight: 600; font-size: 0.875rem; color: var(--gray-900); margin-bottom: 2px; }
.book-author-cell { font-size: 0.78rem; color: var(--gray-500); }
.due-cell { display: flex; flex-direction: column; gap: 2px; }
.due-date { font-size: 0.875rem; font-weight: 600; }
.days-overdue { font-size: 0.72rem; color: var(--red); }
.fine-amount { color: var(--red); font-weight: 700; font-size: 0.9rem; }
.action-cell { display: flex; gap: 8px; }
.btn-xs { padding: 5px 12px; font-size: 0.78rem; border-radius: 6px; }
.btn-ghost { color: var(--green-dark); font-weight: 600; font-size: 0.78rem; padding: 5px 12px; border-radius: 6px; transition: background var(--transition); }
.btn-ghost:hover { background: var(--green-ok-light); }

.empty-state { padding: 40px; text-align: center; color: var(--gray-500); }

.tips { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; overflow: hidden; }
.tip { padding: 24px; border-right: 1px solid var(--gray-100); display: flex; gap: 14px; }
.tip:last-child { border-right: none; }
.tip-icon { font-size: 1.5rem; flex-shrink: 0; }
.tip strong { display: block; font-size: 0.9rem; margin-bottom: 4px; }
.tip p { font-size: 0.8rem; color: var(--gray-500); line-height: 1.5; }
</style>
