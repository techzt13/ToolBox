<template>
  <div class="home">
    <div class="home-hero">
      <h1 class="hero-title">🧰 ToolBox</h1>
      <p class="hero-sub">Your online Swiss Army Knife — 20 free productivity tools</p>
      <SearchBar v-model="query" />
    </div>
    <div class="home-body">
      <div class="cat-tabs">
        <button
          v-for="cat in categories"
          :key="cat"
          :class="['cat-tab', { active: activeCategory === cat }]"
          @click="activeCategory = cat"
        >{{ cat }}</button>
      </div>
      <div class="grid" v-if="filtered.length">
        <ToolCard
          v-for="tool in filtered"
          :key="tool.id"
          :tool="tool"
          :isFav="favs.includes(tool.id)"
          @toggleFav="toggleFav"
        />
      </div>
      <div class="no-results" v-else>
        <div class="no-results-icon">🔍</div>
        <div>No tools found</div>
        <div class="no-results-sub">Try a different search or category</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import SearchBar from '../components/SearchBar.vue'
import ToolCard from '../components/ToolCard.vue'
import { tools } from '../toolRegistry'

const query = ref('')
const activeCategory = ref('All')
const favs = ref([])
const categories = ['All', 'Favourites', 'Convert', 'Text', 'Developer', 'Design', 'Utility']

onMounted(() => {
  const saved = localStorage.getItem('favs')
  if (saved) favs.value = JSON.parse(saved)
})

function toggleFav(id) {
  const idx = favs.value.indexOf(id)
  if (idx === -1) favs.value.push(id)
  else favs.value.splice(idx, 1)
  localStorage.setItem('favs', JSON.stringify(favs.value))
}

const filtered = computed(() => {
  let list = tools
  if (activeCategory.value === 'Favourites') {
    list = list.filter(t => favs.value.includes(t.id))
  } else if (activeCategory.value !== 'All') {
    list = list.filter(t => t.category === activeCategory.value)
  }
  if (query.value.trim()) {
    const q = query.value.toLowerCase()
    list = list.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.keywords.some(k => k.toLowerCase().includes(q))
    )
  }
  return list
})
</script>
<style scoped>
.home { min-height: 100vh; }
.home-hero {
  background: linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%);
  padding: 60px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.hero-title { font-size: 48px; font-weight: 900; color: #fff; letter-spacing: -1px; }
.hero-sub { font-size: 18px; color: rgba(255,255,255,0.85); margin-bottom: 8px; }
.home-body { max-width: 1400px; margin: 0 auto; padding: 32px 24px; }
.cat-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 28px;
}
.cat-tab {
  padding: 8px 18px;
  border-radius: 20px;
  border: 1.5px solid var(--border);
  background: var(--bg-card);
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.cat-tab.active, .cat-tab:hover {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}
.no-results {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-muted);
}
.no-results-icon { font-size: 48px; margin-bottom: 16px; }
.no-results-sub { font-size: 14px; margin-top: 8px; }
@media (max-width: 600px) {
  .hero-title { font-size: 32px; }
  .grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
}
</style>
