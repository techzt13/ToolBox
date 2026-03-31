<template>
  <div class="tool-page">
    <div class="tool-header">
      <button class="back-btn" @click="$router.push('/')">← Back</button>
      <h1 class="tool-title">💰 Tip / Bill Splitter</h1>
    </div>
    <div class="tool-card">
      <div class="form-group">
        <label>Bill Amount ($)</label>
        <input type="number" v-model.number="billAmount" min="0" placeholder="0.00" step="0.01" />
      </div>
      <div class="form-group">
        <label>Tip Percentage (%)</label>
        <div class="tip-quick">
          <button v-for="pct in quickTips" :key="pct" :class="['tip-btn', { active: tipPercent === pct }]" @click="tipPercent = pct">{{ pct }}%</button>
        </div>
        <input type="number" v-model.number="tipPercent" min="0" max="100" placeholder="15" class="mt8" />
      </div>
      <div class="form-group">
        <label>Number of People</label>
        <input type="number" v-model.number="numPeople" min="1" placeholder="1" />
      </div>
      <div v-if="error" class="error">{{ error }}</div>
      <div class="action-row">
        <button class="btn btn-secondary" @click="clearAll">🗑 Clear</button>
      </div>
    </div>
    <div class="results-grid" v-if="!error && billAmount > 0">
      <div class="result-card">
        <div class="res-label">Tip Amount</div>
        <div class="res-val">${{ tipAmount }}</div>
      </div>
      <div class="result-card">
        <div class="res-label">Total Amount</div>
        <div class="res-val">${{ totalAmount }}</div>
      </div>
      <div class="result-card highlight-card">
        <div class="res-label">Per Person</div>
        <div class="res-val big">${{ perPerson }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'

const billAmount = ref('')
const tipPercent = ref(15)
const numPeople = ref(1)
const quickTips = [10, 15, 18, 20, 25]
const error = ref('')

watch([billAmount, tipPercent, numPeople], () => {
  if (numPeople.value < 1) error.value = 'At least 1 person required'
  else if (tipPercent.value < 0) error.value = 'Tip cannot be negative'
  else error.value = ''
})

const tipAmount = computed(() => {
  if (!billAmount.value || error.value) return '0.00'
  return (billAmount.value * tipPercent.value / 100).toFixed(2)
})

const totalAmount = computed(() => {
  if (!billAmount.value || error.value) return '0.00'
  return (billAmount.value * (1 + tipPercent.value / 100)).toFixed(2)
})

const perPerson = computed(() => {
  if (!billAmount.value || error.value || numPeople.value < 1) return '0.00'
  return (parseFloat(totalAmount.value) / numPeople.value).toFixed(2)
})

function clearAll() {
  billAmount.value = ''
  tipPercent.value = 15
  numPeople.value = 1
  error.value = ''
}
</script>
<style scoped>
.tip-quick { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
.tip-btn { padding: 6px 16px; border-radius: 20px; border: 1.5px solid var(--border); background: var(--bg-card); color: var(--text-muted); font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.tip-btn.active, .tip-btn:hover { background: var(--primary); color: #fff; border-color: var(--primary); }
.mt8 { margin-top: 8px; }
.results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; }
.result-card { background: var(--bg-card); border-radius: var(--radius); border: 1.5px solid var(--border); padding: 24px; box-shadow: var(--shadow); text-align: center; }
.highlight-card { border-color: var(--primary); box-shadow: var(--shadow-hover); }
.res-label { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 8px; }
.res-val { font-size: 28px; font-weight: 800; color: var(--primary); }
.res-val.big { font-size: 36px; }
</style>
