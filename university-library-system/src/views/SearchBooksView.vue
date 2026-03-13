<template>
  <div class="search-page">
    <div class="page-container">
      <div class="search-header">
        <button class="back-btn" @click="$router.back()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
        <div>
          <h1>Search Books</h1>
          <p>Browse our library collection</p>
        </div>
      </div>

      <div class="search-box card">
        <div class="search-input-wrap">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input v-model="query" type="text" placeholder="Search by title, author, or ISBN…" />
          <button v-if="query" class="clear-btn" @click="query = ''">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="filters">
          <div class="filter-group">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            <span>Filters:</span>
            <div class="select-wrap">
              <select v-model="selectedCategory">
                <option value="">All Categories</option>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div class="select-wrap">
              <select v-model="selectedStatus">
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="borrowed">Borrowed</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>
            <input v-model="authorFilter" type="text" class="author-filter" placeholder="Filter by author…" />
          </div>
          <div class="results-count badge badge-green">{{ filtered.length }} Books Found</div>
        </div>
      </div>

      <div v-if="!filtered.length" class="empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gray-300)" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <p>No books match your search.</p>
        <button class="btn btn-outline" @click="clearFilters">Clear Filters</button>
      </div>

      <div v-else class="books-grid">
        <BookCard v-for="book in filtered" :key="book.id" :book="book" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { store } from '../store'
import BookCard from '../components/BookCard.vue'

const query = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const authorFilter = ref('')

const categories = computed(() => store.getCategories())

const filtered = computed(() => store.books.filter(b => {
  const q = query.value.toLowerCase()
  if (q && !b.title.toLowerCase().includes(q) && !b.author.toLowerCase().includes(q) && !b.isbn.includes(q)) return false
  if (selectedCategory.value && b.category !== selectedCategory.value) return false
  if (selectedStatus.value && b.status !== selectedStatus.value) return false
  if (authorFilter.value && !b.author.toLowerCase().includes(authorFilter.value.toLowerCase())) return false
  return true
}))

function clearFilters() { query.value = ''; selectedCategory.value = ''; selectedStatus.value = ''; authorFilter.value = '' }
</script>

<style scoped>
.search-page { padding: 32px 0 48px; }
.search-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.search-header h1 { font-size: 1.6rem; color: var(--green-dark); margin-bottom: 2px; }
.search-header p { color: var(--gray-500); font-size: 0.875rem; }
.back-btn { display: flex; align-items: center; gap: 6px; color: var(--gray-500); font-size: 0.875rem; font-weight: 500; padding: 8px 12px; border-radius: 8px; transition: all var(--transition); }
.back-btn:hover { background: var(--gray-100); color: var(--gray-900); }

.search-box { padding: 20px 24px; margin-bottom: 24px; }
.search-input-wrap {
  display: flex; align-items: center; gap: 12px;
  border: 1.5px solid var(--gray-200); border-radius: var(--radius-sm);
  padding: 12px 16px; margin-bottom: 16px; background: var(--gray-50);
  transition: border-color var(--transition);
}
.search-input-wrap:focus-within { border-color: var(--green-dark); background: white; }
.search-input-wrap input { flex: 1; border: none; outline: none; font-size: 0.95rem; background: transparent; color: var(--gray-900); }
.clear-btn { color: var(--gray-400); display: flex; align-items: center; }
.clear-btn:hover { color: var(--gray-700); }

.filters { display: flex; align-items: center; justify-content: space-between; }
.filter-group { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.filter-group svg, .filter-group span { color: var(--gray-500); font-size: 0.875rem; }
.select-wrap select {
  padding: 8px 12px; border-radius: 8px; border: 1.5px solid var(--gray-200);
  font-size: 0.85rem; font-family: inherit; color: var(--gray-700);
  background: white; cursor: pointer; outline: none;
}
.select-wrap select:focus { border-color: var(--green-dark); }
.author-filter {
  padding: 8px 12px; border-radius: 8px; border: 1.5px solid var(--gray-200);
  font-size: 0.85rem; font-family: inherit; outline: none; width: 180px;
}
.author-filter:focus { border-color: var(--green-dark); }

.books-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }

.empty { text-align: center; padding: 64px 24px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
.empty p { color: var(--gray-500); }

.results-count { font-size: 0.82rem; }
</style>
