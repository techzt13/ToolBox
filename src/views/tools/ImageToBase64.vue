<template>
  <div class="tool-page">
    <div class="tool-header">
      <button class="back-btn" @click="$router.push('/')">← Back</button>
      <h1 class="tool-title">🖼️ Image to Base64</h1>
    </div>
    <div class="tool-card">
      <div
        class="drop-zone"
        :class="{ dragging: isDragging }"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        @drop.prevent="onDrop"
        @click="fileInput.click()"
      >
        <input ref="fileInput" type="file" accept="image/*" class="file-input-hidden" @change="onFileChange" />
        <div v-if="!preview">
          <div class="drop-icon">🖼️</div>
          <div class="drop-text">Click or drag & drop an image</div>
          <div class="drop-hint">Supports PNG, JPG, GIF, WebP, SVG...</div>
        </div>
        <img v-else :src="preview" class="preview-img" />
      </div>
      <div v-if="fileInfo" class="file-info">
        <span>{{ fileInfo.name }}</span>
        <span class="file-size">{{ fileInfo.size }}</span>
        <button class="btn btn-secondary" style="padding:6px 14px;font-size:13px" @click="clearAll">✕ Clear</button>
      </div>
    </div>
    <div v-if="base64" class="tool-card">
      <div class="form-group">
        <label>Base64 Output</label>
        <textarea readonly :value="base64" rows="6" class="mono-input"></textarea>
      </div>
      <div class="action-row">
        <button class="btn" @click="copyBase64">📋 Copy</button>
      </div>
      <div v-if="copied" class="success">Copied!</div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const fileInput = ref(null)
const preview = ref('')
const base64 = ref('')
const fileInfo = ref(null)
const isDragging = ref(false)
const copied = ref(false)

function onDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file) processFile(file)
}

function onFileChange(e) {
  const file = e.target.files[0]
  if (file) processFile(file)
}

function processFile(file) {
  if (!file.type.startsWith('image/')) return
  const sizeKB = (file.size / 1024).toFixed(1)
  const sizeMB = (file.size / 1024 / 1024).toFixed(2)
  fileInfo.value = {
    name: file.name,
    size: file.size > 1024 * 1024 ? sizeMB + ' MB' : sizeKB + ' KB'
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    base64.value = e.target.result
    preview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

function clearAll() {
  preview.value = ''
  base64.value = ''
  fileInfo.value = null
  if (fileInput.value) fileInput.value.value = ''
}

async function copyBase64() {
  await navigator.clipboard.writeText(base64.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>
<style scoped>
.drop-zone {
  border: 2px dashed var(--border);
  border-radius: var(--radius);
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.drop-zone:hover, .drop-zone.dragging { border-color: var(--primary); background: var(--bg-input); }
.file-input-hidden { display: none; }
.drop-icon { font-size: 48px; margin-bottom: 12px; }
.drop-text { font-size: 16px; font-weight: 600; color: var(--text); }
.drop-hint { font-size: 13px; color: var(--text-muted); margin-top: 6px; }
.preview-img { max-width: 100%; max-height: 300px; border-radius: 10px; object-fit: contain; }
.file-info { display: flex; align-items: center; gap: 12px; margin-top: 12px; padding: 10px 14px; background: var(--bg-input); border-radius: 10px; flex-wrap: wrap; }
.file-size { font-size: 13px; color: var(--text-muted); flex: 1; }
.mono-input { font-family: monospace; font-size: 12px; }
</style>
