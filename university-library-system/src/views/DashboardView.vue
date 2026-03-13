<template>
  <div class="dashboard">
    <div class="page-container">
      <!-- Header -->
      <div class="dash-header">
        <div>
          <h1>Welcome back, {{ store.currentUser?.name.split(' ')[0] }} 👋</h1>
          <p class="dash-sub">Here's your library activity overview</p>
        </div>
        <div class="dash-date">{{ todayDate }}</div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <router-link to="/search" class="action-card action-card--primary">
          <div class="action-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <span>Search Books</span>
        </router-link>
        <router-link to="/reservations" class="action-card">
          <div class="action-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <span>Reserve Book</span>
        </router-link>
        <router-link to="/loans" class="action-card">
          <div class="action-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          </div>
          <span>Renew Book</span>
        </router-link>
        <router-link to="/loans" class="action-card">
          <div class="action-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          </div>
          <span>View My Loans</span>
        </router-link>
      </div>

      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-content">
            <div>
              <p class="stat-label">Borrowed Books</p>
              <p class="stat-value">{{ userLoans.length }}</p>
            </div>
            <div class="stat-icon stat-icon--blue">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </div>
          </div>
        </div>
        <div class="stat-card stat-card--warn">
          <div class="stat-content">
            <div>
              <p class="stat-label">Overdue Books</p>
              <p class="stat-value stat-value--red">{{ overdueBooks.length }}</p>
            </div>
            <div class="stat-icon stat-icon--red">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-content">
            <div>
              <p class="stat-label">Total Fines</p>
              <p class="stat-value" :class="totalFines > 0 ? 'stat-value--red' : ''">GH₵{{ totalFines.toFixed(2) }}</p>
            </div>
            <div class="stat-icon stat-icon--gold">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-content">
            <div>
              <p class="stat-label">Active Reservations</p>
              <p class="stat-value">{{ store.reservations.length }}</p>
            </div>
            <div class="stat-icon stat-icon--green">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Overdue Alert -->
      <div v-if="overdueBooks.length" class="alert-banner">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div>
          <strong>You have overdue books!</strong>
          <span>Please return or renew them to avoid additional fines. Late fee is GH₵1.00 per day.</span>
        </div>
        <router-link to="/loans" class="btn btn-primary btn-sm-a">View Loans</router-link>
      </div>

      <!-- Borrowed Books -->
      <div class="section">
        <div class="section-header">
          <h2>My Borrowed Books</h2>
          <span class="badge badge-green">{{ userLoans.length }} Books</span>
        </div>
        <div v-if="!userLoans.length" class="empty-state">
          <p>No borrowed books currently.</p>
          <router-link to="/search" class="btn btn-primary">Browse Library</router-link>
        </div>
        <div v-else class="loans-list">
          <div v-for="book in userLoans" :key="book.id" class="loan-item card">
            <div class="loan-cover">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </div>
            <div class="loan-info">
              <p class="loan-title">{{ book.title }}</p>
              <p class="loan-author">{{ book.author }}</p>
            </div>
            <div class="loan-meta">
              <div class="loan-date">
                <span class="meta-label">Due Date</span>
                <span :class="['meta-val', book.status === 'overdue' ? 'text-red' : '']">{{ formatDate(book.dueDate) }}</span>
              </div>
              <div v-if="book.fine" class="loan-fine">
                <span class="meta-label">Fine</span>
                <span class="meta-val text-red">GH₵{{ book.fine.toFixed(2) }}</span>
              </div>
              <span :class="['badge', book.status === 'overdue' ? 'badge-red' : 'badge-green']">
                {{ book.status === 'overdue' ? 'Overdue' : 'Active' }}
              </span>
              <button class="btn btn-outline btn-sm-a" @click="store.renewBook(book.id)">Renew</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="section">
        <div class="section-header"><h2>Library Announcements</h2></div>
        <div class="announcements">
          <div class="announcement-item">
            <div class="ann-dot ann-dot--gold"></div>
            <div>
              <p class="ann-title">Extended Hours During Exams</p>
              <p class="ann-body">The library will be open 24/7 from December 10–20, 2025 during the examination period.</p>
              <span class="ann-date">Dec 1, 2025</span>
            </div>
          </div>
          <div class="announcement-item">
            <div class="ann-dot ann-dot--green"></div>
            <div>
              <p class="ann-title">New Books Arrived</p>
              <p class="ann-body">Over 200 new titles have been added to the Computer Science and Business sections.</p>
              <span class="ann-date">Nov 28, 2025</span>
            </div>
          </div>
          <div class="announcement-item">
            <div class="ann-dot ann-dot--blue"></div>
            <div>
              <p class="ann-title">Digital Resources Available</p>
              <p class="ann-body">Students now have access to JSTOR, Scopus, and IEEE Xplore through the student portal.</p>
              <span class="ann-date">Nov 20, 2025</span>
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

const userLoans = computed(() => store.getUserLoans())
const overdueBooks = computed(() => userLoans.value.filter(b => b.status === 'overdue'))
const totalFines = computed(() => userLoans.value.reduce((s, b) => s + (b.fine || 0), 0))

const todayDate = new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.dashboard { padding: 32px 0 48px; }
.dash-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }
.dash-header h1 { font-size: 1.8rem; color: var(--green-dark); margin-bottom: 4px; }
.dash-sub { color: var(--gray-500); font-size: 0.9rem; }
.dash-date { font-size: 0.82rem; color: var(--gray-400); background: var(--white); padding: 8px 14px; border-radius: 8px; border: 1px solid var(--gray-200); }

.quick-actions { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.action-card {
  background: var(--white); border: 1.5px solid var(--gray-200);
  border-radius: var(--radius); padding: 24px 16px;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  font-size: 0.875rem; font-weight: 600; color: var(--gray-700);
  transition: all var(--transition); text-align: center;
}
.action-card:hover { border-color: var(--green-dark); color: var(--green-dark); transform: translateY(-2px); box-shadow: var(--shadow); }
.action-card--primary { background: var(--green-dark); color: white; border-color: var(--green-dark); }
.action-card--primary:hover { background: var(--green-mid); color: white; }
.action-icon { opacity: 0.85; }

.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.stat-card { background: var(--white); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow); }
.stat-card--warn { border-left: 3px solid var(--red); }
.stat-content { display: flex; justify-content: space-between; align-items: center; }
.stat-label { font-size: 0.8rem; color: var(--gray-500); margin-bottom: 6px; font-weight: 500; }
.stat-value { font-size: 1.8rem; font-weight: 700; color: var(--gray-900); }
.stat-value--red { color: var(--red); }
.stat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.stat-icon--blue { background: #eff6ff; color: #3b82f6; }
.stat-icon--red { background: var(--red-light); color: var(--red); }
.stat-icon--gold { background: var(--gold-pale); color: var(--gold); }
.stat-icon--green { background: var(--green-ok-light); color: var(--green-ok); }

.alert-banner {
  background: var(--red-light); border: 1px solid #fca5a5;
  border-radius: var(--radius); padding: 16px 20px;
  display: flex; align-items: center; gap: 14px;
  color: var(--red); margin-bottom: 24px;
}
.alert-banner svg { flex-shrink: 0; }
.alert-banner div { flex: 1; font-size: 0.875rem; }
.alert-banner strong { display: block; margin-bottom: 2px; }
.btn-sm-a { padding: 7px 14px; font-size: 0.8rem; border-radius: 8px; flex-shrink: 0; }

.section { margin-bottom: 32px; }
.section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.section-header h2 { font-size: 1.3rem; color: var(--gray-900); }

.loans-list { display: flex; flex-direction: column; gap: 12px; }
.loan-item { display: flex; align-items: center; gap: 16px; padding: 16px 20px; }
.loan-cover {
  width: 48px; height: 48px; border-radius: 10px; flex-shrink: 0;
  background: linear-gradient(135deg, var(--green-dark), var(--green-light));
  display: flex; align-items: center; justify-content: center;
}
.loan-info { flex: 1; }
.loan-title { font-weight: 600; font-size: 0.95rem; color: var(--gray-900); margin-bottom: 2px; }
.loan-author { font-size: 0.8rem; color: var(--gray-500); }
.loan-meta { display: flex; align-items: center; gap: 20px; }
.loan-date, .loan-fine { display: flex; flex-direction: column; align-items: flex-end; }
.meta-label { font-size: 0.72rem; color: var(--gray-400); margin-bottom: 2px; }
.meta-val { font-size: 0.875rem; font-weight: 600; }
.text-red { color: var(--red); }

.empty-state { text-align: center; padding: 48px; background: var(--white); border-radius: var(--radius); }
.empty-state p { color: var(--gray-500); margin-bottom: 16px; }

.announcements { display: flex; flex-direction: column; gap: 0; background: var(--white); border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; }
.announcement-item { display: flex; gap: 16px; padding: 20px 24px; border-bottom: 1px solid var(--gray-100); }
.announcement-item:last-child { border-bottom: none; }
.ann-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
.ann-dot--gold { background: var(--gold); }
.ann-dot--green { background: var(--green-ok); }
.ann-dot--blue { background: #3b82f6; }
.ann-title { font-weight: 600; font-size: 0.9rem; margin-bottom: 4px; }
.ann-body { font-size: 0.82rem; color: var(--gray-500); line-height: 1.5; margin-bottom: 6px; }
.ann-date { font-size: 0.72rem; color: var(--gray-400); }
</style>
