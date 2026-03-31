<template>
  <div class="search-wrap">
    <span class="search-icon">🔍</span>
    <input
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      placeholder="Search tools..."
      class="search-input"
    />
    <button v-if="modelValue" class="clear-btn" @click="$emit('update:modelValue', '')">✕</button>
  </div>
</template>
<script setup>
defineProps({ modelValue: String })
defineEmits(['update:modelValue'])
</script>
<style scoped>
.search-wrap {
  position: relative;
  width: 100%;
}
.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  pointer-events: none;
}
.search-input {
  padding-left: 36px;
  padding-right: 36px;
  height: 38px;
  font-size: 14px;
  border-radius: 999px;
  background: var(--surface-2);
  border: 1.5px solid var(--border);
  width: 100%;
  color: var(--text);
  outline: none;
  transition: border-color 0.2s;
}
.search-input:focus {
  border-color: var(--primary);
}
.search-input::placeholder {
  color: var(--muted);
}
.clear-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--muted);
  cursor: pointer;
  font-size: 12px;
  padding: 4px;
  border-radius: 50%;
  line-height: 1;
}
.clear-btn:hover { color: var(--text); }
</style>

