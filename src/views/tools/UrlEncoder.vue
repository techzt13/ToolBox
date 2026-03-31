<template>
  <div class="tool-page">
    <div class="tool-header">
      <button class="back-btn" @click="$router.push('/')">← Back</button>
      <h1 class="tool-title">🔗 URL Encoder/Decoder</h1>
    </div>
    <div class="tool-card">
      <div class="form-group">
        <label>Input</label>
        <textarea v-model="input" rows="5" placeholder="Enter URL or encoded string..."></textarea>
      </div>
      <div class="action-row">
        <button class="btn" @click="encode">🔒 Encode</button>
        <button class="btn btn-secondary" @click="decode">🔓 Decode</button>
        <button class="btn btn-secondary" @click="swap">⇄ Swap</button>
        <button class="btn btn-secondary" @click="clear">🗑 Clear</button>
      </div>
      <div v-if="error" class="error">{{ error }}</div>
    </div>
    <div v-if="output" class="tool-card">
      <div class="form-group">
        <label>Output</label>
        <textarea readonly :value="output" rows="5" class="mono-input"></textarea>
      </div>
      <div class="action-row">
        <button class="btn btn-secondary" @click="copyOutput">📋 Copy</button>
      </div>
      <div v-if="copied" class="success">Copied!</div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const input = ref('')
const output = ref('')
const error = ref('')
const copied = ref(false)

function encode() {
  error.value = ''
  output.value = encodeURIComponent(input.value)
}

function decode() {
  error.value = ''
  try {
    output.value = decodeURIComponent(input.value)
  } catch (e) {
    error.value = 'Invalid encoded string: ' + e.message
    output.value = ''
  }
}

function swap() {
  const tmp = input.value
  input.value = output.value
  output.value = tmp
  error.value = ''
}

function clear() {
  input.value = ''
  output.value = ''
  error.value = ''
}

async function copyOutput() {
  await navigator.clipboard.writeText(output.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>
<style scoped>
.mono-input { font-family: monospace; }
</style>
