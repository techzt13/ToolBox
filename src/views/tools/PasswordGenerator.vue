<template>
  <div class="tool-page">
    <div class="tool-header">
      <button class="back-btn" @click="$router.push('/')">← Back</button>
      <h1 class="tool-title">🔐 Password Generator</h1>
    </div>
    <div class="tool-card">
      <div class="form-group">
        <label>Length: {{ length }}</label>
        <input type="range" v-model.number="length" min="8" max="128" class="slider" />
        <div class="range-labels"><span>8</span><span>128</span></div>
      </div>
      <div class="options-grid">
        <label class="checkbox-label">
          <input type="checkbox" v-model="useUpper" />
          <span>Uppercase (A-Z)</span>
        </label>
        <label class="checkbox-label">
          <input type="checkbox" v-model="useLower" />
          <span>Lowercase (a-z)</span>
        </label>
        <label class="checkbox-label">
          <input type="checkbox" v-model="useNumbers" />
          <span>Numbers (0-9)</span>
        </label>
        <label class="checkbox-label">
          <input type="checkbox" v-model="useSymbols" />
          <span>Symbols (!@#...)</span>
        </label>
      </div>
      <div v-if="optError" class="error">{{ optError }}</div>
      <div class="action-row">
        <button class="btn" @click="generate">🔄 Generate</button>
      </div>
      <div v-if="password" class="password-display">
        <div class="password-text">{{ password }}</div>
        <button class="btn btn-secondary" @click="copyPassword">📋 Copy</button>
      </div>
      <div v-if="password" class="strength-bar">
        <div class="strength-fill" :style="{ width: strengthPct + '%', background: strengthColor }"></div>
      </div>
      <div v-if="password" class="strength-label" :style="{ color: strengthColor }">Strength: {{ strengthLabel }}</div>
      <div v-if="copied" class="success">Copied!</div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, computed } from 'vue'

const length = ref(16)
const useUpper = ref(true)
const useLower = ref(true)
const useNumbers = ref(true)
const useSymbols = ref(false)
const password = ref('')
const copied = ref(false)
const optError = ref('')

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const NUMS = '0123456789'
const SYMS = '!@#$%^&*()_+-=[]{}|;:,.<>?'

function generate() {
  let chars = ''
  if (useUpper.value) chars += UPPER
  if (useLower.value) chars += LOWER
  if (useNumbers.value) chars += NUMS
  if (useSymbols.value) chars += SYMS
  if (!chars) { optError.value = 'Select at least one character type'; return }
  optError.value = ''
  const arr = new Uint32Array(length.value)
  crypto.getRandomValues(arr)
  password.value = Array.from(arr).map(v => chars[v % chars.length]).join('')
}

watch([length, useUpper, useLower, useNumbers, useSymbols], generate, { immediate: true })

const strength = computed(() => {
  if (!password.value) return 0
  let s = 0
  if (useUpper.value) s++
  if (useLower.value) s++
  if (useNumbers.value) s++
  if (useSymbols.value) s++
  if (length.value >= 16) s++
  if (length.value >= 32) s++
  return s
})

const strengthPct = computed(() => Math.min(100, (strength.value / 6) * 100))
const strengthLabel = computed(() => {
  const s = strength.value
  if (s <= 2) return 'Weak'
  if (s <= 3) return 'Fair'
  if (s <= 4) return 'Good'
  return 'Strong'
})
const strengthColor = computed(() => {
  const s = strength.value
  if (s <= 2) return '#ef4444'
  if (s <= 3) return '#f59e0b'
  if (s <= 4) return '#3b82f6'
  return '#22c55e'
})

async function copyPassword() {
  await navigator.clipboard.writeText(password.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>
<style scoped>
.slider { -webkit-appearance: none; appearance: none; height: 6px; border-radius: 4px; background: var(--border); outline: none; padding: 0; border: none; margin-top: 8px; }
.slider::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: var(--primary); cursor: pointer; }
.range-labels { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted); margin-top: 4px; }
.options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0; }
.checkbox-label { display: flex; align-items: center; gap: 10px; font-size: 14px; cursor: pointer; padding: 10px 14px; background: var(--bg-input); border-radius: 10px; border: 1.5px solid var(--border); }
.checkbox-label input { width: auto; }
.password-display { display: flex; align-items: center; gap: 12px; margin-top: 20px; padding: 16px; background: var(--bg-input); border-radius: 12px; border: 1.5px solid var(--border); }
.password-text { font-family: monospace; font-size: 15px; flex: 1; word-break: break-all; }
.strength-bar { height: 6px; background: var(--border); border-radius: 4px; margin-top: 12px; overflow: hidden; }
.strength-fill { height: 100%; border-radius: 4px; transition: width 0.3s, background 0.3s; }
.strength-label { font-size: 13px; font-weight: 600; margin-top: 6px; }
@media (max-width: 480px) { .options-grid { grid-template-columns: 1fr; } }
</style>
