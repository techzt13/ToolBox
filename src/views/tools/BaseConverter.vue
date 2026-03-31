<template>
  <div class="tool-page">
    <div class="tool-header">
      <button class="back-btn" @click="$router.push('/')">← Back</button>
      <h1 class="tool-title">🔢 Base Converter</h1>
    </div>
    <div class="tool-card">
      <div class="form-group">
        <label>Input Value</label>
        <input v-model="inputVal" :placeholder="fromBasePlaceholder" class="mono-input" @input="convert" />
        <div v-if="error" class="error">{{ error }}</div>
      </div>
      <div class="form-group">
        <label>Input Base</label>
        <div class="base-tabs">
          <button v-for="b in bases" :key="b.id" :class="['base-tab', { active: fromBase === b.id }]" @click="fromBase = b.id; convert()">{{ b.label }}</button>
        </div>
      </div>
    </div>
    <div v-if="decimal !== null" class="results-grid">
      <div v-for="b in bases" :key="b.id" class="result-card">
        <div class="result-base-label">{{ b.label }}</div>
        <div class="result-val mono">{{ getConverted(b.id) }}</div>
        <button class="btn btn-secondary copy-sm" @click="copy(getConverted(b.id))">📋</button>
      </div>
    </div>
    <div v-if="copied" class="success" style="margin-top:8px">Copied!</div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'

const bases = [
  { id: 2, label: 'Binary (2)' },
  { id: 8, label: 'Octal (8)' },
  { id: 10, label: 'Decimal (10)' },
  { id: 16, label: 'Hexadecimal (16)' }
]

const inputVal = ref('')
const fromBase = ref(10)
const decimal = ref(null)
const error = ref('')
const copied = ref(false)

const fromBasePlaceholder = computed(() => {
  if (fromBase.value === 2) return 'e.g. 1010'
  if (fromBase.value === 8) return 'e.g. 17'
  if (fromBase.value === 10) return 'e.g. 42'
  return 'e.g. 2A'
})

function convert() {
  error.value = ''
  decimal.value = null
  if (!inputVal.value.trim()) return
  const val = inputVal.value.trim()
  if (fromBase.value === 16 && !/^[0-9a-fA-F]+$/.test(val)) {
    error.value = 'Invalid hex: only 0-9, A-F allowed'
    return
  }
  if (fromBase.value === 2 && !/^[01]+$/.test(val)) {
    error.value = 'Invalid binary: only 0 and 1 allowed'
    return
  }
  if (fromBase.value === 8 && !/^[0-7]+$/.test(val)) {
    error.value = 'Invalid octal: only 0-7 allowed'
    return
  }
  if (fromBase.value === 10 && !/^-?\d+$/.test(val)) {
    error.value = 'Invalid decimal: only digits allowed'
    return
  }
  const d = parseInt(val, fromBase.value)
  if (isNaN(d)) { error.value = 'Invalid input'; return }
  decimal.value = d
}

function getConverted(base) {
  if (decimal.value === null) return ''
  return decimal.value.toString(base).toUpperCase()
}

async function copy(text) {
  await navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>
<style scoped>
.mono-input { font-family: monospace; }
.base-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
.base-tab { padding: 8px 16px; border-radius: 10px; border: 1.5px solid var(--border); background: var(--bg-card); color: var(--text-muted); font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.base-tab.active, .base-tab:hover { background: var(--primary); color: #fff; border-color: var(--primary); }
.results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
.result-card { background: var(--bg-card); border-radius: var(--radius); border: 1.5px solid var(--border); padding: 20px; box-shadow: var(--shadow); display: flex; flex-direction: column; gap: 8px; }
.result-base-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }
.result-val { font-family: monospace; font-size: 18px; font-weight: 700; color: var(--primary); word-break: break-all; flex: 1; }
.mono { font-family: monospace; }
.copy-sm { padding: 6px 12px; font-size: 13px; }
</style>
