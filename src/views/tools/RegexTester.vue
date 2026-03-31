<template>
  <div class="tool-page">
    <div class="tool-header">
      <button class="back-btn" @click="$router.push('/')">← Back</button>
      <h1 class="tool-title">🔍 Regex Tester</h1>
    </div>
    <div class="tool-card">
      <div class="regex-input-row">
        <div class="form-group flex1">
          <label>Pattern</label>
          <input v-model="pattern" placeholder="e.g. \d+" class="mono-input" />
        </div>
        <div class="form-group flags-group">
          <label>Flags</label>
          <input v-model="flags" placeholder="gi" maxlength="6" class="mono-input" style="width:80px" />
        </div>
      </div>
      <div v-if="regexError" class="error">{{ regexError }}</div>
      <div class="form-group">
        <label>Test String</label>
        <textarea v-model="testStr" rows="6" placeholder="Enter text to test against..."></textarea>
      </div>
      <div v-if="matchCount >= 0 && !regexError" class="match-info">
        <span class="match-badge">{{ matchCount }} match{{ matchCount !== 1 ? 'es' : '' }}</span>
      </div>
      <div v-if="!regexError && testStr" class="form-group">
        <label>Highlighted Result</label>
        <div class="highlight-box" v-html="highlighted"></div>
      </div>
      <div v-if="groups.length && !regexError" class="form-group">
        <label>Capture Groups</label>
        <div class="groups-list">
          <div v-for="(g, i) in groups" :key="i" class="group-item">
            <span class="group-num">Match {{ i + 1 }}</span>
            <span class="group-val">{{ g[0] }}</span>
            <template v-if="g.slice(1).length">
              <span class="group-sub" v-for="(sub, j) in g.slice(1)" :key="j">Group {{ j + 1 }}: {{ sub }}</span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'

const pattern = ref('')
const flags = ref('g')
const testStr = ref('')
const regexError = ref('')

const regex = computed(() => {
  if (!pattern.value) return null
  try {
    regexError.value = ''
    return new RegExp(pattern.value, flags.value)
  } catch (e) {
    regexError.value = e.message
    return null
  }
})

const matchCount = computed(() => {
  if (!regex.value || !testStr.value) return 0
  const m = testStr.value.match(regex.value)
  return m ? m.length : 0
})

const highlighted = computed(() => {
  if (!regex.value || !testStr.value) return escapeHtml(testStr.value)
  try {
    const r = new RegExp(pattern.value, flags.value.includes('g') ? flags.value : flags.value + 'g')
    return escapeHtml(testStr.value).replace(
      new RegExp(pattern.value, flags.value.includes('g') ? flags.value : flags.value + 'g'),
      m => `<mark class="match-highlight">${escapeHtml(m)}</mark>`
    )
  } catch { return escapeHtml(testStr.value) }
})

const groups = computed(() => {
  if (!regex.value || !testStr.value) return []
  const r = new RegExp(pattern.value, flags.value.includes('g') ? flags.value : flags.value + 'g')
  const results = []
  let m
  while ((m = r.exec(testStr.value)) !== null) {
    results.push(Array.from(m))
    if (!r.global) break
    if (m[0] === '') r.lastIndex++
  }
  return results
})

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
</script>
<style scoped>
.regex-input-row { display: flex; gap: 12px; align-items: flex-start; }
.flex1 { flex: 1; }
.flags-group { flex-shrink: 0; }
.mono-input { font-family: monospace; }
.match-info { margin: 8px 0; }
.match-badge { display: inline-block; padding: 4px 12px; background: var(--primary); color: #fff; border-radius: 20px; font-size: 13px; font-weight: 600; }
.highlight-box { padding: 12px 14px; background: var(--bg-input); border-radius: 10px; border: 1.5px solid var(--border); font-family: monospace; font-size: 14px; white-space: pre-wrap; word-break: break-all; min-height: 48px; line-height: 1.6; }
:global(.match-highlight) { background: #fef08a; color: #1a1a1a; border-radius: 3px; padding: 1px 2px; }
[data-theme="dark"] :global(.match-highlight) { background: #854d0e; color: #fef9c3; }
.groups-list { display: flex; flex-direction: column; gap: 8px; }
.group-item { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; padding: 10px 14px; background: var(--bg-input); border-radius: 10px; }
.group-num { font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
.group-val { font-family: monospace; font-size: 14px; color: var(--primary); font-weight: 600; }
.group-sub { font-size: 13px; font-family: monospace; color: var(--text-muted); }
</style>
