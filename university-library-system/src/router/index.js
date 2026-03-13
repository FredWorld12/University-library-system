import { createRouter, createWebHashHistory } from 'vue-router'
import { store } from '../store'

import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import SearchBooksView from '../views/SearchBooksView.vue'
import BookDetailView from '../views/BookDetailView.vue'
import MyLoansView from '../views/MyLoansView.vue'
import ReservationsView from '../views/ReservationsView.vue'
import LibrarianView from '../views/LibrarianView.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView, meta: { guest: true } },
  { path: '/dashboard', component: DashboardView, meta: { auth: true } },
  { path: '/search', component: SearchBooksView, meta: { auth: true } },
  { path: '/book/:id', component: BookDetailView, meta: { auth: true } },
  { path: '/loans', component: MyLoansView, meta: { auth: true } },
  { path: '/reservations', component: ReservationsView, meta: { auth: true } },
  { path: '/librarian', component: LibrarianView, meta: { auth: true, librarian: true } },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})

router.beforeEach((to, from, next) => {
  if (to.meta.auth && !store.currentUser) return next('/login')
  if (to.meta.guest && store.currentUser) return next('/dashboard')
  if (to.meta.librarian && store.currentUser?.role !== 'librarian') return next('/dashboard')
  next()
})

export default router
