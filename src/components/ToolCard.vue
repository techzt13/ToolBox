<template>
  <div class="card" @click="$router.push(tool.route)">
    <div class="card-top">
      <div class="card-icon-wrap">{{ tool.icon }}</div>
      <span class="card-badge">{{ tool.category }}</span>
    </div>
    <div class="card-name">{{ tool.name }}</div>
    <div class="card-desc">{{ tool.description }}</div>
    <button class="fav-btn" @click.stop="$emit('toggleFav', tool.id)" :class="{ active: isFav }">
      {{ isFav ? '⭐' : '☆' }}
    </button>
  </div>
</template>
<script setup>
defineProps({ tool: Object, isFav: Boolean })
defineEmits(['toggleFav'])
</script>
<style scoped>
.card {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 20px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-soft);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.card:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-hover);
  transform: translateY(-3px);
}
.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}
.card-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: var(--surface-2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}
.card-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 999px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--muted);
  white-space: nowrap;
}
.card-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.3;
}
.card-desc {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.5;
  flex: 1;
}
.fav-btn {
  position: absolute;
  bottom: 14px;
  right: 14px;
  background: none;
  border: none;
  font-size: 16px;
  padding: 4px;
  border-radius: 8px;
  color: var(--muted);
  opacity: 0.4;
  transition: all 0.2s;
}
.fav-btn.active {
  color: #f59e0b;
  opacity: 1;
}
.card:hover .fav-btn {
  opacity: 1;
}
.fav-btn:hover {
  background: var(--surface-2);
}
</style>

