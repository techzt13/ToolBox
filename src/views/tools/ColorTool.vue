<template>
  <div class="tool-page">
    <div class="tool-header">
      <button class="back-btn" @click="$router.push('/')">← Back</button>
      <h1 class="tool-title">🎨 Color Tool</h1>
    </div>
    <div class="tab-bar">
      <button v-for="t in tabs" :key="t" :class="['tab-btn', { active: tab === t }]" @click="tab = t">{{ t }}</button>
    </div>

    <div v-if="tab === 'Picker'" class="tool-card">
      <div class="picker-center">
        <input type="color" v-model="pickedColor" class="color-picker-input" />
        <div class="color-swatch" :style="{ background: pickedColor }"></div>
      </div>
      <div class="color-values">
        <div class="color-value-row">
          <span class="cv-label">HEX</span>
          <span class="cv-val">{{ pickedColor.toUpperCase() }}</span>
          <button class="btn btn-secondary copy-sm" @click="copy(pickedColor.toUpperCase())">📋</button>
        </div>
        <div class="color-value-row">
          <span class="cv-label">RGB</span>
          <span class="cv-val">{{ hexToRgbStr(pickedColor) }}</span>
          <button class="btn btn-secondary copy-sm" @click="copy(hexToRgbStr(pickedColor))">📋</button>
        </div>
        <div class="color-value-row">
          <span class="cv-label">HSL</span>
          <span class="cv-val">{{ hexToHslStr(pickedColor) }}</span>
          <button class="btn btn-secondary copy-sm" @click="copy(hexToHslStr(pickedColor))">📋</button>
        </div>
      </div>
      <div v-if="copied" class="success">Copied!</div>
    </div>

    <div v-if="tab === 'Converter'" class="tool-card">
      <div class="form-group">
        <label>HEX</label>
        <input type="text" v-model="hexInput" placeholder="#3b82f6" maxlength="7" @input="onHexInput" />
        <div v-if="hexError" class="error">{{ hexError }}</div>
      </div>
      <div class="rgb-row">
        <div class="form-group flex1">
          <label>R (0-255)</label>
          <input type="number" v-model.number="rgbR" min="0" max="255" @input="onRgbInput" />
        </div>
        <div class="form-group flex1">
          <label>G (0-255)</label>
          <input type="number" v-model.number="rgbG" min="0" max="255" @input="onRgbInput" />
        </div>
        <div class="form-group flex1">
          <label>B (0-255)</label>
          <input type="number" v-model.number="rgbB" min="0" max="255" @input="onRgbInput" />
        </div>
      </div>
      <div v-if="convColor" class="conv-preview">
        <div class="conv-swatch" :style="{ background: convColor }"></div>
        <div class="color-values">
          <div class="color-value-row">
            <span class="cv-label">HEX</span>
            <span class="cv-val">{{ convColor.toUpperCase() }}</span>
            <button class="btn btn-secondary copy-sm" @click="copy(convColor.toUpperCase())">📋</button>
          </div>
          <div class="color-value-row">
            <span class="cv-label">RGB</span>
            <span class="cv-val">{{ hexToRgbStr(convColor) }}</span>
            <button class="btn btn-secondary copy-sm" @click="copy(hexToRgbStr(convColor))">📋</button>
          </div>
          <div class="color-value-row">
            <span class="cv-label">HSL</span>
            <span class="cv-val">{{ hexToHslStr(convColor) }}</span>
            <button class="btn btn-secondary copy-sm" @click="copy(hexToHslStr(convColor))">📋</button>
          </div>
        </div>
      </div>
      <div v-if="copied" class="success">Copied!</div>
    </div>

    <div v-if="tab === 'Palette'" class="tool-card">
      <div class="form-group">
        <label>Base Color</label>
        <div class="palette-pick-row">
          <input type="color" v-model="paletteBase" class="color-picker-small" />
          <span>{{ paletteBase.toUpperCase() }}</span>
        </div>
      </div>
      <div class="palette-section">
        <div class="palette-label">Tints (lighter)</div>
        <div class="palette-swatches">
          <div v-for="(c, i) in tints" :key="i" class="palette-swatch" :style="{ background: c }" @click="copy(c)" :title="c">
            <span class="swatch-hex">{{ c.toUpperCase() }}</span>
          </div>
        </div>
      </div>
      <div class="palette-section">
        <div class="palette-label">Shades (darker)</div>
        <div class="palette-swatches">
          <div v-for="(c, i) in shades" :key="i" class="palette-swatch" :style="{ background: c }" @click="copy(c)" :title="c">
            <span class="swatch-hex">{{ c.toUpperCase() }}</span>
          </div>
        </div>
      </div>
      <div v-if="copied" class="success">Copied!</div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'

const tabs = ['Picker', 'Converter', 'Palette']
const tab = ref('Picker')
const pickedColor = ref('#3b82f6')
const copied = ref(false)
const hexInput = ref('')
const hexError = ref('')
const rgbR = ref(59)
const rgbG = ref(130)
const rgbB = ref(246)
const convColor = ref('#3b82f6')
const paletteBase = ref('#3b82f6')

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

function hexToRgbStr(hex) {
  const { r, g, b } = hexToRgb(hex)
  return `rgb(${r}, ${g}, ${b})`
}

function hexToHslStr(hex) {
  let { r, g, b } = hexToRgb(hex)
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('')
}

function onHexInput() {
  const val = hexInput.value.trim()
  if (!/^#[0-9a-fA-F]{6}$/.test(val)) { hexError.value = 'Invalid HEX (e.g. #3b82f6)'; return }
  hexError.value = ''
  convColor.value = val
  const { r, g, b } = hexToRgb(val)
  rgbR.value = r; rgbG.value = g; rgbB.value = b
}

function onRgbInput() {
  if ([rgbR.value, rgbG.value, rgbB.value].some(v => v < 0 || v > 255 || isNaN(v))) return
  convColor.value = rgbToHex(rgbR.value, rgbG.value, rgbB.value)
  hexInput.value = convColor.value
  hexError.value = ''
}

function mixWithWhite(hex, t) {
  const { r, g, b } = hexToRgb(hex)
  return rgbToHex(Math.round(r + (255 - r) * t), Math.round(g + (255 - g) * t), Math.round(b + (255 - b) * t))
}

function mixWithBlack(hex, t) {
  const { r, g, b } = hexToRgb(hex)
  return rgbToHex(Math.round(r * (1 - t)), Math.round(g * (1 - t)), Math.round(b * (1 - t)))
}

const tints = computed(() => [0.2, 0.35, 0.5, 0.65, 0.8].map(t => mixWithWhite(paletteBase.value, t)))
const shades = computed(() => [0.2, 0.35, 0.5, 0.65, 0.8].map(t => mixWithBlack(paletteBase.value, t)))

async function copy(text) {
  await navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>
<style scoped>
.tab-bar { display: flex; gap: 8px; margin-bottom: 20px; }
.tab-btn { padding: 8px 20px; border-radius: 10px; border: 1.5px solid var(--border); background: var(--bg-card); color: var(--text-muted); font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.tab-btn.active, .tab-btn:hover { background: var(--primary); color: #fff; border-color: var(--primary); }
.picker-center { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; }
.color-picker-input { width: 80px; height: 80px; border-radius: 12px; border: none; padding: 0; cursor: pointer; }
.color-swatch { width: 80px; height: 80px; border-radius: 12px; border: 1.5px solid var(--border); }
.color-values { display: flex; flex-direction: column; gap: 10px; }
.color-value-row { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-input); border-radius: 10px; }
.cv-label { font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); width: 32px; flex-shrink: 0; }
.cv-val { font-family: monospace; font-size: 14px; flex: 1; }
.copy-sm { padding: 6px 10px; font-size: 13px; }
.rgb-row { display: flex; gap: 12px; }
.flex1 { flex: 1; }
.conv-preview { display: flex; gap: 20px; align-items: flex-start; margin-top: 16px; flex-wrap: wrap; }
.conv-swatch { width: 80px; height: 80px; border-radius: 12px; border: 1.5px solid var(--border); flex-shrink: 0; }
.palette-pick-row { display: flex; align-items: center; gap: 12px; }
.color-picker-small { width: 48px; height: 48px; border-radius: 8px; border: none; padding: 0; cursor: pointer; }
.palette-section { margin-top: 20px; }
.palette-label { font-size: 13px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px; }
.palette-swatches { display: flex; gap: 10px; flex-wrap: wrap; }
.palette-swatch { width: 80px; height: 64px; border-radius: 10px; cursor: pointer; display: flex; align-items: flex-end; padding: 4px; transition: transform 0.15s; border: 1.5px solid rgba(0,0,0,0.1); }
.palette-swatch:hover { transform: scale(1.05); }
.swatch-hex { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.9); text-shadow: 0 1px 2px rgba(0,0,0,0.5); }
</style>
