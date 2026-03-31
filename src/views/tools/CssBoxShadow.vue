<template>
  <div class="tool-page">
    <div class="tool-header">
      <button class="back-btn" @click="$router.push('/')">← Back</button>
      <h1 class="tool-title">🪞 CSS Box Shadow</h1>
    </div>
    <div class="layout">
      <div class="controls-col">
        <div class="tool-card">
          <div class="form-group">
            <label>Horizontal Offset: {{ hOffset }}px</label>
            <input type="range" v-model.number="hOffset" min="-50" max="50" class="slider" />
          </div>
          <div class="form-group">
            <label>Vertical Offset: {{ vOffset }}px</label>
            <input type="range" v-model.number="vOffset" min="-50" max="50" class="slider" />
          </div>
          <div class="form-group">
            <label>Blur: {{ blur }}px</label>
            <input type="range" v-model.number="blur" min="0" max="100" class="slider" />
          </div>
          <div class="form-group">
            <label>Spread: {{ spread }}px</label>
            <input type="range" v-model.number="spread" min="-50" max="50" class="slider" />
          </div>
          <div class="form-group">
            <label>Opacity: {{ opacity }}%</label>
            <input type="range" v-model.number="opacity" min="0" max="100" class="slider" />
          </div>
          <div class="form-group">
            <label>Color</label>
            <input type="color" v-model="shadowColor" class="color-mini" />
          </div>
          <label class="checkbox-label">
            <input type="checkbox" v-model="inset" />
            <span>Inset</span>
          </label>
        </div>
      </div>
      <div class="preview-col">
        <div class="preview-area">
          <div class="preview-box" :style="{ boxShadow: cssValue }"></div>
        </div>
        <div class="tool-card">
          <div class="form-group">
            <label>CSS Code</label>
            <div class="code-box"><code>box-shadow: {{ cssValue }};</code></div>
          </div>
          <div class="action-row">
            <button class="btn" @click="copyCSS">📋 Copy CSS</button>
          </div>
          <div v-if="copied" class="success">Copied!</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'

const hOffset = ref(4)
const vOffset = ref(4)
const blur = ref(16)
const spread = ref(0)
const shadowColor = ref('#000000')
const opacity = ref(20)
const inset = ref(false)
const copied = ref(false)

function hexToRgba(hex, opacityPct) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${(opacityPct / 100).toFixed(2)})`
}

const cssValue = computed(() => {
  const color = hexToRgba(shadowColor.value, opacity.value)
  const ins = inset.value ? 'inset ' : ''
  return `${ins}${hOffset.value}px ${vOffset.value}px ${blur.value}px ${spread.value}px ${color}`
})

async function copyCSS() {
  await navigator.clipboard.writeText(`box-shadow: ${cssValue.value};`)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>
<style scoped>
.layout { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.slider { -webkit-appearance: none; appearance: none; height: 6px; border-radius: 4px; background: var(--border); outline: none; padding: 0; border: none; margin-top: 6px; width: 100%; }
.slider::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: var(--primary); cursor: pointer; }
.color-mini { width: 60px; height: 40px; border-radius: 8px; border: 1.5px solid var(--border); padding: 2px; cursor: pointer; }
.checkbox-label { display: flex; align-items: center; gap: 10px; font-size: 14px; cursor: pointer; padding: 10px 14px; background: var(--bg-input); border-radius: 10px; border: 1.5px solid var(--border); }
.checkbox-label input { width: auto; }
.preview-area { background: var(--bg-card); border-radius: var(--radius); border: 1.5px solid var(--border); height: 200px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
.preview-box { width: 100px; height: 100px; background: var(--primary); border-radius: 12px; transition: box-shadow 0.2s; }
.code-box { background: var(--bg-input); border-radius: 10px; border: 1.5px solid var(--border); padding: 12px 16px; font-family: monospace; font-size: 13px; word-break: break-all; }
@media (max-width: 700px) { .layout { grid-template-columns: 1fr; } }
</style>
