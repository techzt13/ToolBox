<template>
  <div class="tool-page">
    <div class="tool-header">
      <button class="back-btn" @click="$router.push('/')">← Back</button>
      <h1 class="tool-title">📱 QR Code Generator</h1>
    </div>
    <div class="tool-card">
      <div class="form-group">
        <label>Text or URL</label>
        <input v-model="text" placeholder="https://example.com or any text..." @input="generate" />
      </div>
      <div class="form-group">
        <label>Error Correction Level</label>
        <select v-model="ecLevel" @change="generate">
          <option value="L">L — Low (~7%)</option>
          <option value="M">M — Medium (~15%)</option>
          <option value="Q">Q — Quartile (~25%)</option>
          <option value="H">H — High (~30%)</option>
        </select>
      </div>
      <div v-if="error" class="error">{{ error }}</div>
      <div class="action-row">
        <button class="btn" @click="generate">🔄 Generate</button>
        <button class="btn btn-secondary" @click="clearAll">🗑 Clear</button>
        <button v-if="hasQr" class="btn btn-secondary" @click="download">⬇️ Download PNG</button>
      </div>
    </div>
    <div v-if="hasQr" class="qr-display">
      <canvas ref="canvasRef" class="qr-canvas"></canvas>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import QRCode from 'qrcode'

const text = ref('')
const ecLevel = ref('M')
const error = ref('')
const hasQr = ref(false)
const canvasRef = ref(null)

async function generate() {
  error.value = ''
  if (!text.value.trim()) { hasQr.value = false; return }
  hasQr.value = true
  await new Promise(r => setTimeout(r, 10))
  try {
    await QRCode.toCanvas(canvasRef.value, text.value, {
      errorCorrectionLevel: ecLevel.value,
      width: 280,
      margin: 2
    })
  } catch (e) {
    error.value = e.message
    hasQr.value = false
  }
}

function clearAll() {
  text.value = ''
  hasQr.value = false
  error.value = ''
}

function download() {
  if (!canvasRef.value) return
  const link = document.createElement('a')
  link.download = 'qrcode.png'
  link.href = canvasRef.value.toDataURL('image/png')
  link.click()
}
</script>
<style scoped>
.qr-display {
  display: flex;
  justify-content: center;
  padding: 20px;
  background: var(--bg-card);
  border-radius: var(--radius);
  border: 1.5px solid var(--border);
  box-shadow: var(--shadow);
}
.qr-canvas {
  border-radius: 12px;
  max-width: 100%;
}
</style>
