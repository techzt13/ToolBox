<template>
  <div class="tool-page">
    <div class="tool-header">
      <button class="back-btn" @click="$router.push('/')">← Back</button>
      <h1 class="tool-title">📋 Lorem Ipsum Generator</h1>
    </div>
    <div class="tool-card">
      <div class="controls-row">
        <div class="form-group flex1">
          <label>Type</label>
          <select v-model="type">
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>
        <div class="form-group count-group">
          <label>Count (1-20)</label>
          <input type="number" v-model.number="count" min="1" max="20" />
        </div>
      </div>
      <div class="action-row">
        <button class="btn" @click="generate">🔄 Generate</button>
        <button class="btn btn-secondary" @click="output = ''">🗑 Clear</button>
        <button v-if="output" class="btn btn-secondary" @click="copyOutput">📋 Copy</button>
      </div>
      <div v-if="copied" class="success">Copied!</div>
    </div>
    <div v-if="output" class="tool-card">
      <div class="lorem-output">{{ output }}</div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const type = ref('paragraphs')
const count = ref(3)
const output = ref('')
const copied = ref(false)

const wordPool = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum proin viverra mauris vitae ultricies leo integer malesuada nunc vel risus commodo viverra maecenas accumsan lacus vel facilisis volutpat est velit egestas dui id ornare arcu odio ut sem nulla pharetra diam sit amet nisl suscipit adipiscing bibendum est ultricies integer quis auctor'.split(' ')

function randomWord() { return wordPool[Math.floor(Math.random() * wordPool.length)] }

function randomSentence() {
  const len = 8 + Math.floor(Math.random() * 12)
  const words = Array.from({ length: len }, randomWord)
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
  return words.join(' ') + '.'
}

function randomParagraph() {
  const sentCount = 3 + Math.floor(Math.random() * 4)
  return Array.from({ length: sentCount }, randomSentence).join(' ')
}

function generate() {
  const n = Math.max(1, Math.min(20, count.value))
  if (type.value === 'paragraphs') {
    output.value = Array.from({ length: n }, randomParagraph).join('\n\n')
  } else if (type.value === 'sentences') {
    output.value = Array.from({ length: n }, randomSentence).join(' ')
  } else {
    output.value = Array.from({ length: n }, randomWord).join(' ')
  }
}

async function copyOutput() {
  await navigator.clipboard.writeText(output.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>
<style scoped>
.controls-row { display: flex; gap: 16px; align-items: flex-start; }
.flex1 { flex: 1; }
.count-group { width: 140px; flex-shrink: 0; }
.lorem-output { font-size: 15px; line-height: 1.8; color: var(--text); white-space: pre-wrap; }
</style>
