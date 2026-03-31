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
  max-width: 480px;
}
.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  pointer-events: none;
}
.search-input {
  padding-left: 44px;
  padding-right: 40px;
  height: 48px;
  font-size: 15px;
  border-radius: 12px;
}
.clear-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
  border-radius: 50%;
}
.clear-btn:hover { color: var(--text); }
</style>
