<template>
  <div id="app">
    <AppNavbar v-if="store.currentUser" />
    <main :class="{ 'with-nav': store.currentUser }">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <NotificationToast />
  </div>
</template>

<script setup>
import AppNavbar from './components/AppNavbar.vue'
import NotificationToast from './components/NotificationToast.vue'
import { store } from './store'
</script>

<style>
.with-nav { padding-top: 72px; }
main { min-height: 100vh; }
</style>
