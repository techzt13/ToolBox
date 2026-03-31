<template>
  <div class="tool-page">
    <div class="tool-header">
      <button class="back-btn" @click="$router.push('/')">← Back</button>
      <h1 class="tool-title">📄 Markdown Previewer</h1>
    </div>
    <div class="md-layout">
      <div class="md-panel">
        <div class="panel-label">Markdown</div>
        <div class="action-row" style="margin-bottom:8px">
          <button class="btn btn-secondary" @click="mdText = ''">🗑 Clear</button>
        </div>
        <textarea v-model="mdText" rows="20" class="md-textarea" placeholder="# Hello World&#10;&#10;Write **markdown** here..."></textarea>
      </div>
      <div class="md-panel">
        <div class="panel-label">Preview</div>
        <div class="md-preview" v-html="rendered"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { marked } from 'marked'

const mdText = ref(`# Welcome to Markdown Previewer

Write your **markdown** on the left and see the *live preview* here.

## Features
- Headings
- **Bold** and *italic* text
- Lists
- [Links](https://github.com)
- \`inline code\`

\`\`\`js
console.log("Hello, ToolBox!")
\`\`\`

> Blockquotes work too!
`)

const rendered = computed(() => {
  return marked(mdText.value, { breaks: true })
})
</script>
<style scoped>
.md-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.md-panel {
  display: flex;
  flex-direction: column;
}
.panel-label {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 8px;
}
.md-textarea {
  flex: 1;
  font-family: monospace;
  font-size: 14px;
  resize: vertical;
  min-height: 400px;
}
.md-preview {
  background: var(--bg-card);
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  min-height: 400px;
  overflow-y: auto;
  line-height: 1.7;
  font-size: 15px;
}
:deep(.md-preview h1),
:deep(.md-preview h2),
:deep(.md-preview h3) { margin: 16px 0 8px; font-weight: 700; }
:deep(.md-preview p) { margin-bottom: 12px; }
:deep(.md-preview ul),
:deep(.md-preview ol) { padding-left: 24px; margin-bottom: 12px; }
:deep(.md-preview code) { background: var(--bg-input); border-radius: 4px; padding: 2px 6px; font-family: monospace; font-size: 13px; }
:deep(.md-preview pre) { background: var(--bg-input); border-radius: 10px; padding: 16px; overflow-x: auto; margin-bottom: 12px; }
:deep(.md-preview pre code) { background: none; padding: 0; }
:deep(.md-preview blockquote) { border-left: 4px solid var(--primary); padding-left: 16px; color: var(--text-muted); margin: 12px 0; }
:deep(.md-preview a) { color: var(--primary); text-decoration: underline; }
:deep(.md-preview table) { border-collapse: collapse; width: 100%; margin-bottom: 12px; }
:deep(.md-preview th),
:deep(.md-preview td) { border: 1px solid var(--border); padding: 8px 12px; }
:deep(.md-preview th) { background: var(--bg-input); }
@media (max-width: 700px) { .md-layout { grid-template-columns: 1fr; } }
</style>
