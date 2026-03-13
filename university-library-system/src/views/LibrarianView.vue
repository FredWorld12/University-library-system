<template>
  <div class="admin-page">
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Librarian Dashboard</h1>
          <p>Manage books, loans, and library operations</p>
        </div>
        <span class="admin-badge">Admin</span>
      </div>

      <!-- Stats -->
      <div class="admin-stats">
        <div class="astat card">
          <p class="astat-label">Total Books</p>
          <p class="astat-val">{{ store.books.length }}</p>
          <p class="astat-sub">In collection</p>
        </div>
        <div class="astat card">
          <p class="astat-label">Available</p>
          <p class="astat-val text-green">{{ availableBooks }}</p>
          <p class="astat-sub">Ready to borrow</p>
        </div>
        <div class="astat card">
          <p class="astat-label">Borrowed</p>
          <p class="astat-val">{{ borrowedBooks }}</p>
          <p class="astat-sub">Currently out</p>
        </div>
        <div class="astat card">
          <p class="astat-label">Overdue</p>
          <p class="astat-val text-red">{{ overdueBooks }}</p>
          <p class="astat-sub">Need follow-up</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="admin-tabs">
        <button v-for="tab in tabs" :key="tab.id" :class="['tab', activeTab === tab.id ? 'tab--active' : '']" @click="activeTab = tab.id">
          {{ tab.label }}
        </button>
      </div>

      <!-- Manage Books -->
      <div v-if="activeTab === 'books'">
        <div class="section-actions">
          <h2>Book Inventory</h2>
          <button class="btn btn-primary" @click="showAddBook = true">+ Add New Book</button>
        </div>
        <div class="admin-table card">
          <div class="at-header">
            <span>Title / Author</span><span>Category</span><span>ISBN</span><span>Status</span><span>Actions</span>
          </div>
          <div v-for="book in store.books" :key="book.id" class="at-row">
            <div class="at-book">
              <div class="at-thumb">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              </div>
              <div>
                <p class="at-title">{{ book.title }}</p>
                <p class="at-author">{{ book.author }}</p>
              </div>
            </div>
            <span class="badge badge-gold">{{ book.category }}</span>
            <span class="at-isbn">{{ book.isbn }}</span>
            <span :class="['badge', book.status === 'available' ? 'badge-green' : book.status === 'overdue' ? 'badge-red' : 'badge-gray']">{{ book.status }}</span>
            <div class="at-actions">
              <button class="btn-icon" @click="editBook(book)" title="Edit">✏️</button>
              <button class="btn-icon" @click="deleteBook(book.id)" title="Delete">🗑️</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Manage Loans -->
      <div v-if="activeTab === 'loans'">
        <div class="section-actions">
          <h2>Active Loans</h2>
          <div class="search-mini">
            <input v-model="loanSearch" type="text" placeholder="Search loans…" />
          </div>
        </div>
        <div class="admin-table card">
          <div class="at-header at-header--loans">
            <span>Book</span><span>Borrower</span><span>Due Date</span><span>Status</span><span>Fine</span><span>Actions</span>
          </div>
          <div v-for="book in filteredLoans" :key="book.id" :class="['at-row', 'at-row--loans', book.status === 'overdue' ? 'row--overdue' : '']">
            <p class="at-title">{{ book.title }}</p>
            <span class="borrower-chip">
              <div class="borrower-av">JM</div>
              <span>John Mensah</span>
            </span>
            <span :class="['due-txt', book.status === 'overdue' ? 'text-red' : '']">{{ formatDate(book.dueDate) }}</span>
            <span :class="['badge', book.status === 'overdue' ? 'badge-red' : 'badge-green']">{{ book.status }}</span>
            <span :class="book.fine ? 'text-red fw' : 'text-gray'">{{ book.fine ? `GH₵${book.fine.toFixed(2)}` : '—' }}</span>
            <div class="at-actions">
              <button class="btn btn-outline btn-xs-a" @click="markReturned(book)">Mark Returned</button>
              <button class="btn btn-ghost-xs" @click="store.renewBook(book.id)">Renew</button>
            </div>
          </div>
          <div v-if="!filteredLoans.length" class="at-empty">No loans found.</div>
        </div>
      </div>

      <!-- Reports -->
      <div v-if="activeTab === 'reports'">
        <h2 class="mb20">Library Reports</h2>
        <div class="reports-grid">
          <div class="report-card card">
            <h3>Category Distribution</h3>
            <div class="cat-bars">
              <div v-for="cat in categoryStats" :key="cat.name" class="cat-bar-item">
                <div class="cat-bar-label">
                  <span>{{ cat.name }}</span>
                  <span>{{ cat.count }}</span>
                </div>
                <div class="cat-bar-track">
                  <div class="cat-bar-fill" :style="{ width: (cat.count / store.books.length * 100) + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="report-card card">
            <h3>Status Overview</h3>
            <div class="status-donut">
              <div v-for="s in statusStats" :key="s.label" class="status-row">
                <div class="status-dot" :style="{ background: s.color }"></div>
                <span class="status-name">{{ s.label }}</span>
                <div class="status-bar-track">
                  <div class="status-bar-fill" :style="{ width: (s.count / store.books.length * 100) + '%', background: s.color }"></div>
                </div>
                <span class="status-cnt">{{ s.count }}</span>
              </div>
            </div>
          </div>
          <div class="report-card card report-card--full">
            <h3>Quick Statistics</h3>
            <div class="quick-stats">
              <div class="qs-item">
                <span class="qs-label">Total Fines Outstanding</span>
                <span class="qs-val text-red">GH₵5.00</span>
              </div>
              <div class="qs-item">
                <span class="qs-label">Books Available Rate</span>
                <span class="qs-val text-green">{{ Math.round(availableBooks / store.books.length * 100) }}%</span>
              </div>
              <div class="qs-item">
                <span class="qs-label">Active Reservations</span>
                <span class="qs-val">{{ store.reservations.length }}</span>
              </div>
              <div class="qs-item">
                <span class="qs-label">Overdue Rate</span>
                <span class="qs-val text-red">{{ Math.round(overdueBooks / store.books.length * 100) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Book Modal -->
    <div v-if="showAddBook || editingBook" class="modal-overlay" @click.self="closeModal">
      <div class="modal card">
        <h2>{{ editingBook ? 'Edit Book' : 'Add New Book' }}</h2>
        <form @submit.prevent="saveBook" class="modal-form">
          <div class="field"><label>Title</label><input v-model="bookForm.title" type="text" required placeholder="Book title" /></div>
          <div class="field"><label>Author</label><input v-model="bookForm.author" type="text" required placeholder="Author name" /></div>
          <div class="field"><label>ISBN</label><input v-model="bookForm.isbn" type="text" required placeholder="978-0-XXXXXX-XX-X" /></div>
          <div class="field">
            <label>Category</label>
            <select v-model="bookForm.category" required>
              <option value="">Select category</option>
              <option v-for="cat in store.getCategories()" :key="cat" :value="cat">{{ cat }}</option>
              <option value="Mathematics">Mathematics</option>
            </select>
          </div>
          <div class="field"><label>Description</label><textarea v-model="bookForm.description" rows="3" placeholder="Book description…"></textarea></div>
          <div class="modal-actions">
            <button type="button" class="btn btn-outline" @click="closeModal">Cancel</button>
            <button type="submit" class="btn btn-primary">{{ editingBook ? 'Save Changes' : 'Add Book' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { store } from '../store'

const activeTab = ref('books')
const tabs = [
  { id: 'books', label: 'Book Inventory' },
  { id: 'loans', label: 'Active Loans' },
  { id: 'reports', label: 'Reports' },
]

const showAddBook = ref(false)
const editingBook = ref(null)
const loanSearch = ref('')

const bookForm = reactive({ title: '', author: '', isbn: '', category: '', description: '' })

const availableBooks = computed(() => store.books.filter(b => b.status === 'available').length)
const borrowedBooks = computed(() => store.books.filter(b => b.status === 'borrowed').length)
const overdueBooks = computed(() => store.books.filter(b => b.status === 'overdue').length)

const allLoans = computed(() => store.books.filter(b => b.borrowedBy))
const filteredLoans = computed(() => {
  const q = loanSearch.value.toLowerCase()
  return allLoans.value.filter(b => !q || b.title.toLowerCase().includes(q))
})

const categoryStats = computed(() => {
  const counts = {}
  store.books.forEach(b => { counts[b.category] = (counts[b.category] || 0) + 1 })
  return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
})

const statusStats = computed(() => [
  { label: 'Available', count: availableBooks.value, color: '#16a34a' },
  { label: 'Borrowed', count: borrowedBooks.value, color: '#6b7280' },
  { label: 'Overdue', count: overdueBooks.value, color: '#dc2626' },
  { label: 'Reserved', count: store.books.filter(b => b.status === 'reserved').length, color: '#c9a84c' },
])

function editBook(book) {
  editingBook.value = book
  Object.assign(bookForm, { title: book.title, author: book.author, isbn: book.isbn, category: book.category, description: book.description || '' })
}

function deleteBook(id) {
  store.books = store.books.filter(b => b.id !== id)
  store.addNotification('Book removed from inventory', 'info')
}

function saveBook() {
  if (editingBook.value) {
    Object.assign(editingBook.value, bookForm)
    store.addNotification('Book updated successfully', 'success')
  } else {
    store.books.push({ id: Date.now(), ...bookForm, status: 'available' })
    store.addNotification(`"${bookForm.title}" added to library`, 'success')
  }
  closeModal()
}

function closeModal() {
  showAddBook.value = false
  editingBook.value = null
  Object.assign(bookForm, { title: '', author: '', isbn: '', category: '', description: '' })
}

function markReturned(book) {
  book.status = 'available'
  book.borrowedBy = null
  book.fine = 0
  book.dueDate = null
  store.addNotification(`"${book.title}" marked as returned`, 'success')
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.admin-page { padding: 32px 0 48px; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; }
.page-header h1 { font-size: 1.8rem; color: var(--green-dark); margin-bottom: 4px; }
.page-header p { color: var(--gray-500); font-size: 0.875rem; }
.admin-badge { background: var(--gold); color: white; padding: 4px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; }

.admin-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
.astat { padding: 20px 24px; }
.astat-label { font-size: 0.78rem; color: var(--gray-500); font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 8px; }
.astat-val { font-size: 2.2rem; font-weight: 700; color: var(--gray-900); line-height: 1; margin-bottom: 4px; }
.astat-sub { font-size: 0.78rem; color: var(--gray-400); }
.text-green { color: var(--green-ok); }
.text-red { color: var(--red); }
.text-gray { color: var(--gray-400); }
.fw { font-weight: 700; }

.admin-tabs { display: flex; gap: 4px; background: var(--gray-100); border-radius: 10px; padding: 4px; margin-bottom: 24px; width: fit-content; }
.tab { padding: 8px 20px; border-radius: 8px; font-size: 0.875rem; font-weight: 500; color: var(--gray-500); transition: all var(--transition); }
.tab--active { background: white; color: var(--green-dark); font-weight: 600; box-shadow: var(--shadow); }

.section-actions { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.section-actions h2 { font-size: 1.2rem; }
.search-mini input { padding: 8px 14px; border-radius: 8px; border: 1.5px solid var(--gray-200); font-size: 0.875rem; font-family: inherit; outline: none; width: 220px; }
.search-mini input:focus { border-color: var(--green-dark); }

.admin-table { overflow: hidden; margin-bottom: 24px; }
.at-header {
  display: grid; grid-template-columns: 2.5fr 1fr 1.5fr 1fr 0.8fr;
  padding: 12px 20px; background: var(--gray-50);
  font-size: 0.75rem; font-weight: 600; color: var(--gray-500);
  text-transform: uppercase; letter-spacing: 0.04em;
  border-bottom: 1px solid var(--gray-200);
}
.at-header--loans { grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr 1.5fr; }
.at-row {
  display: grid; grid-template-columns: 2.5fr 1fr 1.5fr 1fr 0.8fr;
  padding: 14px 20px; align-items: center;
  border-bottom: 1px solid var(--gray-100);
  transition: background var(--transition);
}
.at-row:last-child { border-bottom: none; }
.at-row:hover { background: var(--gray-50); }
.at-row--loans { grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr 1.5fr; }
.row--overdue { background: #fff5f5; }

.at-book { display: flex; align-items: center; gap: 10px; }
.at-thumb {
  width: 34px; height: 34px; border-radius: 6px; flex-shrink: 0;
  background: linear-gradient(135deg, var(--green-dark), var(--green-light));
  display: flex; align-items: center; justify-content: center;
}
.at-title { font-weight: 600; font-size: 0.875rem; color: var(--gray-900); }
.at-author { font-size: 0.78rem; color: var(--gray-500); }
.at-isbn { font-size: 0.78rem; color: var(--gray-400); font-family: monospace; }
.at-actions { display: flex; gap: 6px; align-items: center; }
.btn-icon { font-size: 1rem; padding: 4px; border-radius: 6px; transition: background var(--transition); }
.btn-icon:hover { background: var(--gray-100); }

.borrower-chip { display: flex; align-items: center; gap: 8px; }
.borrower-av {
  width: 28px; height: 28px; border-radius: 50%;
  background: var(--green-dark); color: white;
  font-size: 0.72rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.due-txt { font-size: 0.875rem; font-weight: 500; }
.btn-xs-a { padding: 5px 12px; font-size: 0.78rem; border-radius: 6px; }
.btn-ghost-xs { font-size: 0.78rem; color: var(--green-dark); font-weight: 600; padding: 5px 12px; border-radius: 6px; transition: background var(--transition); }
.btn-ghost-xs:hover { background: var(--green-ok-light); }
.at-empty { padding: 32px; text-align: center; color: var(--gray-500); }

/* Reports */
.mb20 { margin-bottom: 20px; }
.reports-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.report-card { padding: 24px 28px; }
.report-card h3 { font-size: 1rem; margin-bottom: 20px; color: var(--gray-900); }
.report-card--full { grid-column: 1 / -1; }

.cat-bars { display: flex; flex-direction: column; gap: 14px; }
.cat-bar-item {}
.cat-bar-label { display: flex; justify-content: space-between; font-size: 0.82rem; color: var(--gray-700); margin-bottom: 4px; }
.cat-bar-track { height: 8px; background: var(--gray-100); border-radius: 4px; overflow: hidden; }
.cat-bar-fill { height: 100%; background: var(--green-dark); border-radius: 4px; transition: width 0.6s ease; }

.status-donut { display: flex; flex-direction: column; gap: 16px; }
.status-row { display: flex; align-items: center; gap: 10px; }
.status-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.status-name { font-size: 0.82rem; color: var(--gray-700); min-width: 70px; }
.status-bar-track { flex: 1; height: 8px; background: var(--gray-100); border-radius: 4px; overflow: hidden; }
.status-bar-fill { height: 100%; border-radius: 4px; transition: width 0.6s ease; }
.status-cnt { font-size: 0.82rem; font-weight: 700; min-width: 20px; text-align: right; }

.quick-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.qs-item { display: flex; flex-direction: column; gap: 6px; padding: 16px; background: var(--gray-50); border-radius: var(--radius-sm); }
.qs-label { font-size: 0.78rem; color: var(--gray-500); font-weight: 500; }
.qs-val { font-size: 1.5rem; font-weight: 700; color: var(--gray-900); }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 24px; }
.modal { width: 100%; max-width: 480px; padding: 36px; }
.modal h2 { font-size: 1.4rem; margin-bottom: 24px; }
.modal-form { display: flex; flex-direction: column; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-size: 0.875rem; font-weight: 600; color: var(--gray-700); }
.field input, .field select, .field textarea {
  padding: 10px 14px; border-radius: var(--radius-sm);
  border: 1.5px solid var(--gray-200); font-size: 0.9rem;
  font-family: inherit; outline: none; background: var(--gray-50);
  transition: border-color var(--transition);
}
.field input:focus, .field select:focus, .field textarea:focus { border-color: var(--green-dark); background: white; }
.field textarea { resize: vertical; }
.modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; }
</style>
