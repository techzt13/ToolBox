<template>
  <div class="tool-page">
    <div class="tool-header">
      <button class="back-btn" @click="$router.push('/')">← Back</button>
      <h1 class="tool-title">🌈 Gradient Generator</h1>
    </div>
    <div class="tool-card">
      <div class="form-group">
        <label>Type</label>
        <div class="type-tabs">
          <button :class="['type-tab', { active: gradType === 'linear' }]" @click="gradType = 'linear'">Linear</button>
          <button :class="['type-tab', { active: gradType === 'radial' }]" @click="gradType = 'radial'">Radial</button>
        </div>
      </div>
      <div v-if="gradType === 'linear'" class="form-group">
        <label>Angle: {{ angle }}°</label>
        <input type="range" v-model.number="angle" min="0" max="360" class="slider" />
      </div>
      <div class="form-group">
        <label>Color Stops</label>
        <div class="stops-list">
          <div v-for="(stop, i) in stops" :key="i" class="stop-row">
            <input type="color" v-model="stops[i]" class="color-mini" />
            <span class="stop-val">{{ stops[i].toUpperCase() }}</span>
            <button v-if="stops.length > 2" class="remove-btn" @click="stops.splice(i, 1)">✕</button>
          </div>
        </div>
        <button v-if="stops.length < 5" class="btn btn-secondary" style="margin-top:10px" @click="stops.push('#ffffff')">+ Add Color</button>
      </div>
    </div>
    <div class="preview-card">
      <div class="gradient-preview" :style="{ background: gradientCss }"></div>
    </div>
    <div class="tool-card">
      <div class="form-group">
        <label>CSS Code</label>
        <div class="code-box">
          <code>background: {{ gradientCss }};</code>
        </div>
      </div>
      <div class="action-row">
        <button class="btn" @click="copyCSS">📋 Copy CSS</button>
      </div>
      <div v-if="copied" class="success">Copied!</div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'

const gradType = ref('linear')
const angle = ref(135)
const stops = ref(['#2563eb', '#7c3aed'])
const copied = ref(false)

const gradientCss = computed(() => {
  const colorStops = stops.value.join(', ')
  if (gradType.value === 'radial') return `radial-gradient(circle, ${colorStops})`
  return `linear-gradient(${angle.value}deg, ${colorStops})`
})

async function copyCSS() {
  await navigator.clipboard.writeText(`background: ${gradientCss.value};`)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>
<style scoped>
.type-tabs, .base-tabs { display: flex; gap: 8px; margin-bottom: 0; }
.type-tab { padding: 8px 20px; border-radius: 10px; border: 1.5px solid var(--border); background: var(--bg-card); color: var(--text-muted); font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.type-tab.active, .type-tab:hover { background: var(--primary); color: #fff; border-color: var(--primary); }
.slider { -webkit-appearance: none; appearance: none; height: 6px; border-radius: 4px; background: var(--border); outline: none; padding: 0; border: none; margin-top: 8px; width: 100%; }
.slider::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: var(--primary); cursor: pointer; }
.stops-list { display: flex; flex-direction: column; gap: 10px; }
.stop-row { display: flex; align-items: center; gap: 12px; }
.color-mini { width: 48px; height: 40px; border-radius: 8px; border: 1.5px solid var(--border); padding: 2px; cursor: pointer; }
.stop-val { font-family: monospace; font-size: 14px; flex: 1; }
.remove-btn { background: none; border: none; color: var(--error); font-size: 14px; padding: 4px 8px; border-radius: 6px; }
.remove-btn:hover { background: #fee2e2; }
.preview-card { margin-bottom: 20px; border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); border: 1.5px solid var(--border); }
.gradient-preview { height: 180px; width: 100%; }
.code-box { background: var(--bg-input); border-radius: 10px; border: 1.5px solid var(--border); padding: 12px 16px; font-family: monospace; font-size: 13px; word-break: break-all; }
</style>
