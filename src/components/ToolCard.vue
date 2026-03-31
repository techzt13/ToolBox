<template>
  <div class="card" @click="$router.push(tool.route)">
    <button class="fav-btn" @click.stop="$emit('toggleFav', tool.id)" :class="{ active: isFav }">
      {{ isFav ? '⭐' : '☆' }}
    </button>
    <div class="card-icon">{{ tool.icon }}</div>
    <div class="card-name">{{ tool.name }}</div>
    <div class="card-cat">{{ tool.category }}</div>
    <div class="card-desc">{{ tool.description }}</div>
  </div>
</template>
<script setup>
defineProps({ tool: Object, isFav: Boolean })
defineEmits(['toggleFav'])
</script>
<style scoped>
.card {
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 24px 20px 20px;
  border: 1.5px solid var(--border);
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.card:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-hover);
  transform: translateY(-3px);
}
.fav-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 18px;
  padding: 4px;
  border-radius: 8px;
  color: var(--text-muted);
  transition: all 0.2s;
}
.fav-btn.active { color: #f59e0b; }
.fav-btn:hover { background: var(--bg-input); }
.card-icon { font-size: 36px; }
.card-name { font-size: 16px; font-weight: 700; color: var(--text); }
.card-cat {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--primary);
}
.card-desc { font-size: 13px; color: var(--text-muted); line-height: 1.5; }
</style>
