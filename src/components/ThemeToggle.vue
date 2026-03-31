<template>
  <button class="theme-btn" @click="$emit('toggle')" :title="theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'">
    {{ theme === 'light' ? '🌙' : '☀️' }}
  </button>
</template>
<script setup>
defineProps({ theme: String })
defineEmits(['toggle'])
</script>
<style scoped>
.theme-btn {
  background: var(--bg-input);
  border: 1.5px solid var(--border);
  border-radius: 50%;
  width: 42px;
  height: 42px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}
.theme-btn:hover { border-color: var(--primary); }
</style>
