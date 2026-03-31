<template>
  <div class="tool-page">
    <div class="tool-header">
      <button class="back-btn" @click="$router.push('/')">← Back</button>
      <h1 class="tool-title">📝 Word Counter</h1>
    </div>
    <div class="tool-card">
      <div class="form-group">
        <label>Your Text</label>
        <textarea v-model="text" rows="10" placeholder="Start typing or paste text here..."></textarea>
      </div>
      <div class="action-row">
        <button class="btn btn-secondary" @click="text = ''">🗑 Clear</button>
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-val">{{ stats.words }}</div>
        <div class="stat-label">Words</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">{{ stats.chars }}</div>
        <div class="stat-label">Characters</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">{{ stats.charsNoSpace }}</div>
        <div class="stat-label">Chars (no spaces)</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">{{ stats.sentences }}</div>
        <div class="stat-label">Sentences</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">{{ stats.paragraphs }}</div>
        <div class="stat-label">Paragraphs</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">{{ stats.readingTime }}</div>
        <div class="stat-label">Reading Time</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'

const text = ref('')

const stats = computed(() => {
  const t = text.value
  const words = t.trim() ? t.trim().split(/\s+/).filter(w => w.length > 0).length : 0
  const chars = t.length
  const charsNoSpace = t.replace(/\s/g, '').length
  const sentences = t.trim() ? (t.match(/[^.!?]*[.!?]+/g) || []).length : 0
  const paragraphs = t.trim() ? t.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0
  const mins = Math.ceil(words / 200)
  const readingTime = mins < 1 ? '< 1 min' : mins + ' min' + (mins > 1 ? 's' : '')
  return { words, chars, charsNoSpace, sentences, paragraphs, readingTime }
})
</script>
<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}
.stat-card {
  background: var(--bg-card);
  border-radius: var(--radius);
  border: 1.5px solid var(--border);
  box-shadow: var(--shadow);
  padding: 20px;
  text-align: center;
}
.stat-val { font-size: 32px; font-weight: 800; color: var(--primary); }
.stat-label { font-size: 13px; color: var(--text-muted); margin-top: 4px; }
</style>
