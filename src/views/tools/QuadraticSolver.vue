<template>
  <div class="tool-page">
    <div class="tool-header">
      <button class="back-btn" @click="$router.push('/')">← Back</button>
      <h1 class="tool-title">📐 Quadratic Solver</h1>
    </div>
    <div class="tool-card">
      <p class="equation-preview">{{ equationDisplay }}</p>
      <div class="coeff-row">
        <div class="form-group flex1">
          <label>a</label>
          <input type="number" v-model.number="a" placeholder="1" />
        </div>
        <div class="form-group flex1">
          <label>b</label>
          <input type="number" v-model.number="b" placeholder="0" />
        </div>
        <div class="form-group flex1">
          <label>c</label>
          <input type="number" v-model.number="c" placeholder="0" />
        </div>
      </div>
      <div class="action-row">
        <button class="btn" @click="solve">Solve</button>
        <button class="btn btn-secondary" @click="clear">Clear</button>
      </div>
    </div>
    <div v-if="result" class="tool-card">
      <div class="step" v-for="(s, i) in result.steps" :key="i" v-html="s"></div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'

const a = ref('')
const b = ref('')
const c = ref('')
const result = ref(null)

const equationDisplay = computed(() => {
  const av = a.value !== '' ? a.value : 'a'
  const bv = b.value !== '' ? Math.abs(b.value) : 'b'
  const cv = c.value !== '' ? Math.abs(c.value) : 'c'
  const bSign = b.value < 0 ? ' - ' : ' + '
  const cSign = c.value < 0 ? ' - ' : ' + '
  return `${av}x² ${bSign}${bv}x ${cSign}${cv} = 0`
})

function fmt(n) {
  return parseFloat(n.toFixed(6))
}

function solve() {
  const A = parseFloat(a.value), B = parseFloat(b.value), C = parseFloat(c.value)
  const steps = []

  if (isNaN(A) || isNaN(B) || isNaN(C)) {
    result.value = { steps: ['<span class="error-text">Please enter valid numbers for a, b, and c.</span>'] }
    return
  }

  if (A === 0 && B === 0 && C === 0) {
    result.value = { steps: ['<b>Infinite solutions</b> — all values of x satisfy the equation.'] }
    return
  }
  if (A === 0 && B === 0) {
    result.value = { steps: ['<b>No solution</b> — the equation reduces to ' + C + ' = 0.'] }
    return
  }
  if (A === 0) {
    const x = -C / B
    result.value = { steps: [`<b>Linear equation</b> (a = 0): ${B}x + ${C} = 0`, `x = -${C} / ${B} = <b>${fmt(x)}</b>`] }
    return
  }

  const disc = B * B - 4 * A * C
  steps.push(`<b>Equation:</b> ${fmt(A)}x² + ${fmt(B)}x + ${fmt(C)} = 0`)
  steps.push(`<b>Discriminant:</b> Δ = b² - 4ac = ${fmt(B)}² - 4(${fmt(A)})(${fmt(C)}) = <b>${fmt(disc)}</b>`)

  if (disc > 0) {
    const x1 = (-B + Math.sqrt(disc)) / (2 * A)
    const x2 = (-B - Math.sqrt(disc)) / (2 * A)
    steps.push(`<b>Two real roots</b> (Δ > 0):`)
    steps.push(`x₁ = (-${fmt(B)} + √${fmt(disc)}) / (2×${fmt(A)}) = <b>${fmt(x1)}</b>`)
    steps.push(`x₂ = (-${fmt(B)} - √${fmt(disc)}) / (2×${fmt(A)}) = <b>${fmt(x2)}</b>`)
  } else if (disc === 0) {
    const x = -B / (2 * A)
    steps.push(`<b>One real root</b> (Δ = 0):`)
    steps.push(`x = -b / (2a) = -${fmt(B)} / (2×${fmt(A)}) = <b>${fmt(x)}</b>`)
  } else {
    const realPart = -B / (2 * A)
    const imagPart = Math.sqrt(-disc) / (2 * A)
    steps.push(`<b>Two complex roots</b> (Δ < 0):`)
    steps.push(`x₁ = <b>${fmt(realPart)} + ${fmt(imagPart)}i</b>`)
    steps.push(`x₂ = <b>${fmt(realPart)} - ${fmt(imagPart)}i</b>`)
  }

  result.value = { steps }
}

function clear() {
  a.value = ''; b.value = ''; c.value = ''
  result.value = null
}
</script>
<style scoped>
.coeff-row { display: flex; gap: 12px; align-items: flex-start; }
.flex1 { flex: 1; }
.equation-preview { font-size: 18px; font-weight: 700; text-align: center; padding: 12px; background: var(--bg-input); border-radius: 10px; margin-bottom: 20px; font-family: monospace; color: var(--primary); }
.step { padding: 10px 14px; margin-bottom: 8px; background: var(--bg-input); border-radius: 10px; font-size: 15px; line-height: 1.6; }
:deep(.error-text) { color: var(--error); }
@media (max-width: 480px) { .coeff-row { flex-direction: column; } }
</style>
