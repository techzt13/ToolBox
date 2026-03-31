<template>
  <div class="tool-page">
    <div class="tool-header">
      <button class="back-btn" @click="$router.push('/')">← Back</button>
      <h1 class="tool-title">↔️ Text Diff Tool</h1>
    </div>
    <div class="diff-inputs">
      <div class="form-group">
        <label>Original Text</label>
        <textarea v-model="original" rows="8" placeholder="Original text..."></textarea>
      </div>
      <div class="form-group">
        <label>Modified Text</label>
        <textarea v-model="modified" rows="8" placeholder="Modified text..."></textarea>
      </div>
    </div>
    <div class="tool-card" v-if="diffLines.length">
      <div class="diff-stats">
        <span class="added-badge">+{{ addedCount }} added</span>
        <span class="removed-badge">-{{ removedCount }} removed</span>
        <span class="same-badge">{{ sameCount }} unchanged</span>
      </div>
      <div class="diff-output">
        <div v-for="(line, i) in diffLines" :key="i" :class="['diff-line', line.type]">
          <span class="diff-prefix">{{ line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' ' }}</span>
          <span class="diff-text">{{ line.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'

const original = ref('')
const modified = ref('')

function lcs(a, b) {
  const m = a.length, n = b.length
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1])
    }
  }
  return dp
}

function backtrack(dp, a, b, i, j) {
  if (i === 0 && j === 0) return []
  if (i === 0) return [...backtrack(dp, a, b, 0, j - 1), { type: 'added', text: b[j - 1] }]
  if (j === 0) return [...backtrack(dp, a, b, i - 1, 0), { type: 'removed', text: a[i - 1] }]
  if (a[i - 1] === b[j - 1]) return [...backtrack(dp, a, b, i - 1, j - 1), { type: 'same', text: a[i - 1] }]
  if (dp[i - 1][j] >= dp[i][j - 1]) return [...backtrack(dp, a, b, i - 1, j), { type: 'removed', text: a[i - 1] }]
  return [...backtrack(dp, a, b, i, j - 1), { type: 'added', text: b[j - 1] }]
}

const diffLines = computed(() => {
  const a = original.value.split('\n')
  const b = modified.value.split('\n')
  if (!original.value && !modified.value) return []
  const dp = lcs(a, b)
  return backtrack(dp, a, b, a.length, b.length)
})

const addedCount = computed(() => diffLines.value.filter(l => l.type === 'added').length)
const removedCount = computed(() => diffLines.value.filter(l => l.type === 'removed').length)
const sameCount = computed(() => diffLines.value.filter(l => l.type === 'same').length)
</script>
<style scoped>
.diff-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
.diff-stats { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
.added-badge { padding: 4px 12px; background: #dcfce7; color: #166534; border-radius: 20px; font-size: 13px; font-weight: 600; }
.removed-badge { padding: 4px 12px; background: #fee2e2; color: #991b1b; border-radius: 20px; font-size: 13px; font-weight: 600; }
.same-badge { padding: 4px 12px; background: var(--bg-input); color: var(--text-muted); border-radius: 20px; font-size: 13px; font-weight: 600; }
[data-theme="dark"] .added-badge { background: #14532d; color: #86efac; }
[data-theme="dark"] .removed-badge { background: #7f1d1d; color: #fca5a5; }
.diff-output { font-family: monospace; font-size: 13px; }
.diff-line { display: flex; gap: 8px; padding: 3px 8px; border-radius: 4px; }
.diff-line.added { background: #dcfce7; }
.diff-line.removed { background: #fee2e2; }
[data-theme="dark"] .diff-line.added { background: rgba(20, 83, 45, 0.5); }
[data-theme="dark"] .diff-line.removed { background: rgba(127, 29, 29, 0.5); }
.diff-prefix { width: 16px; flex-shrink: 0; color: var(--text-muted); font-weight: 700; }
.diff-line.added .diff-prefix { color: #166534; }
.diff-line.removed .diff-prefix { color: #991b1b; }
[data-theme="dark"] .diff-line.added .diff-prefix { color: #86efac; }
[data-theme="dark"] .diff-line.removed .diff-prefix { color: #fca5a5; }
.diff-text { flex: 1; white-space: pre-wrap; word-break: break-all; }
@media (max-width: 600px) { .diff-inputs { grid-template-columns: 1fr; } }
</style>
