<template>
  <div class="home">
    <div class="home-body">
      <div class="cat-tabs">
        <button
          v-for="cat in categories"
          :key="cat"
          :class="['cat-tab', { active: activeCategory === cat }]"
          @click="setCategory(cat)"
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
import ToolCard from '../components/ToolCard.vue'
import { tools } from '../toolRegistry'
import { searchQuery, activeCategory } from '../state'

const favs = ref([])
const categories = ['All', 'Convert', 'Text', 'Developer', 'Design', 'Utility']

onMounted(() => {
  const saved = localStorage.getItem('favs')
  if (saved) favs.value = JSON.parse(saved)
})

function setCategory(cat) {
  activeCategory.value = cat
}

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
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
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
.home-body { max-width: 1140px; margin: 0 auto; padding: 16px 20px 40px; }
.cat-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}
.cat-tab {
  padding: 7px 18px;
  border-radius: 999px;
  border: 1.5px solid var(--border);
  background: var(--surface);
  color: var(--muted);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.cat-tab:hover {
  border-color: var(--primary);
  color: var(--primary);
}
.cat-tab.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
.no-results {
  text-align: center;
  padding: 80px 20px;
  color: var(--muted);
}
.no-results-icon { font-size: 48px; margin-bottom: 16px; }
.no-results-sub { font-size: 14px; margin-top: 8px; }
@media (max-width: 600px) {
  .grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
}
</style>

