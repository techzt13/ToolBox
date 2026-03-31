<template>
  <div class="tool-page">
    <div class="tool-header">
      <button class="back-btn" @click="$router.push('/')">← Back</button>
      <h1 class="tool-title">{ } JSON Formatter</h1>
    </div>
    <div class="tool-card">
      <div class="form-group">
        <label>JSON Input</label>
        <textarea v-model="input" rows="10" placeholder='{"name":"ToolBox","version":1}'></textarea>
      </div>
      <div v-if="error" class="error">{{ error }}</div>
      <div class="action-row">
        <button class="btn" @click="format">✨ Format</button>
        <button class="btn btn-secondary" @click="minify">📦 Minify</button>
        <button class="btn btn-secondary" @click="clear">🗑 Clear</button>
        <button v-if="output" class="btn btn-secondary" @click="copyOutput">📋 Copy</button>
      </div>
      <div v-if="copied" class="success">Copied!</div>
      <div v-if="output" class="output-box">
        <pre class="json-output">{{ output }}</pre>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const input = ref('')
const output = ref('')
const error = ref('')
const copied = ref(false)

function format() {
  error.value = ''
  try {
    output.value = JSON.stringify(JSON.parse(input.value), null, 2)
  } catch (e) {
    error.value = 'Invalid JSON: ' + e.message
    output.value = ''
  }
}

function minify() {
  error.value = ''
  try {
    output.value = JSON.stringify(JSON.parse(input.value))
  } catch (e) {
    error.value = 'Invalid JSON: ' + e.message
    output.value = ''
  }
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
.output-box {
  margin-top: 16px;
  background: var(--bg-input);
  border-radius: 12px;
  border: 1.5px solid var(--border);
  overflow: auto;
  max-height: 400px;
}
.json-output {
  margin: 0;
  padding: 16px;
  font-family: monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre;
  color: var(--text);
}
</style>
