<template>
  <div class="tool-page">
    <div class="tool-header">
      <button class="back-btn" @click="$router.push('/')">← Back</button>
      <h1 class="tool-title">Aa Case Converter</h1>
    </div>
    <div class="tool-card">
      <div class="form-group">
        <label>Input Text</label>
        <textarea v-model="input" rows="5" placeholder="Enter your text here..."></textarea>
      </div>
      <div class="action-row">
        <button class="btn btn-secondary" @click="input = ''">🗑 Clear</button>
      </div>
    </div>
    <div class="tool-card">
      <div class="form-group">
        <label>Converted Output</label>
      </div>
      <div class="conversions">
        <div v-for="conv in conversions" :key="conv.label" class="conv-row">
          <div class="conv-label-cell">{{ conv.label }}</div>
          <div class="conv-value">{{ conv.fn(input) }}</div>
          <button class="btn btn-secondary copy-sm" @click="copy(conv.fn(input))">📋</button>
        </div>
      </div>
      <div v-if="copied" class="success" style="margin-top:8px">Copied!</div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const input = ref('')
const copied = ref(false)

function toTitle(str) {
  return str.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase())
}
function toSentence(str) {
  return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())
}
function toCamel(str) {
  return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
}
function toPascal(str) {
  const c = toCamel(str)
  return c.charAt(0).toUpperCase() + c.slice(1)
}
function toSnake(str) {
  return str.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '')
}
function toKebab(str) {
  return str.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '')
}
function toDot(str) {
  return str.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '.').replace(/^\.|\.$/g, '')
}
function toConstant(str) {
  return str.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '')
}

const conversions = [
  { label: 'UPPER CASE', fn: s => s.toUpperCase() },
  { label: 'lower case', fn: s => s.toLowerCase() },
  { label: 'Title Case', fn: toTitle },
  { label: 'Sentence case', fn: toSentence },
  { label: 'camelCase', fn: toCamel },
  { label: 'PascalCase', fn: toPascal },
  { label: 'snake_case', fn: toSnake },
  { label: 'kebab-case', fn: toKebab },
  { label: 'dot.case', fn: toDot },
  { label: 'CONSTANT_CASE', fn: toConstant }
]

async function copy(text) {
  await navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>
<style scoped>
.conversions { display: flex; flex-direction: column; gap: 8px; }
.conv-row { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-input); border-radius: 10px; }
.conv-label-cell { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); width: 120px; flex-shrink: 0; }
.conv-value { flex: 1; font-family: monospace; font-size: 14px; word-break: break-all; }
.copy-sm { padding: 6px 10px; font-size: 13px; flex-shrink: 0; }
</style>
