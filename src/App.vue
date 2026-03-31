<template>
  <div :data-theme="theme">
    <header class="topbar-shell">
      <div class="topbar-wrap">
        <div class="topbar-card">
          <router-link to="/" class="logo">
            <div class="logo-sq">🧰</div>
            <div>
              <div class="logo-name">ToolBox</div>
              <div class="logo-sub">Your online Swiss Army Knife</div>
            </div>
          </router-link>
          <div class="search-slot">
            <SearchBar v-model="searchQuery" />
          </div>
          <div class="topbar-actions">
            <button
              class="favs-btn"
              :class="{ active: activeCategory === 'Favourites' }"
              @click="toggleFavs"
            >★ Favourites</button>
            <ThemeToggle :theme="theme" @toggle="toggleTheme" />
          </div>
        </div>
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
import SearchBar from './components/SearchBar.vue'
import { searchQuery, activeCategory } from './state'

const theme = ref('light')
const prevCategory = ref('All')

onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved) theme.value = saved
})

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value)
}

function toggleFavs() {
  if (activeCategory.value === 'Favourites') {
    activeCategory.value = prevCategory.value
  } else {
    prevCategory.value = activeCategory.value
    activeCategory.value = 'Favourites'
  }
}
</script>

<style scoped>
.topbar-shell {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 16px 20px 12px;
}
.topbar-wrap {
  max-width: 1140px;
  margin: 0 auto;
}
.topbar-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 20px;
  background: var(--topbar-glass);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  backdrop-filter: blur(6px);
  box-shadow: var(--shadow-soft);
}
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
}
.logo-sq {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}
.logo-name {
  font-size: 17px;
  font-weight: 800;
  color: var(--primary);
  letter-spacing: -0.3px;
  line-height: 1.2;
}
.logo-sub {
  font-size: 11px;
  color: var(--muted);
  line-height: 1.2;
}
.search-slot {
  flex: 1;
  max-width: 300px;
  min-width: 180px;
}
.topbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.favs-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1.5px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.favs-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}
.favs-btn.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}
@media (max-width: 640px) {
  .topbar-card {
    flex-wrap: wrap;
    gap: 10px;
  }
  .search-slot {
    order: 3;
    max-width: 100%;
    width: 100%;
    flex-basis: 100%;
  }
  .logo-sub { display: none; }
}
</style>

