<template>
  <div :data-theme="theme">
    <header class="topbar">
      <div class="topbar-inner">
        <router-link to="/" class="logo">
          <span class="logo-icon">🧰</span>
          <div>
            <div class="logo-name">ToolBox</div>
            <div class="logo-slogan">Your online Swiss Army Knife</div>
          </div>
        </router-link>
        <ThemeToggle :theme="theme" @toggle="toggleTheme" />
      </div>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ThemeToggle from './components/ThemeToggle.vue'

const theme = ref('light')
onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved) theme.value = saved
})
function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value)
}
</script>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-card);
  border-bottom: 1.5px solid var(--border);
  box-shadow: var(--shadow);
}
.topbar-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}
.logo-icon { font-size: 32px; }
.logo-name { font-size: 20px; font-weight: 800; color: var(--primary); letter-spacing: -0.5px; }
.logo-slogan { font-size: 11px; color: var(--text-muted); }
</style>
