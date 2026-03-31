<template>
  <div class="tool-page">
    <div class="tool-header">
      <button class="back-btn" @click="$router.push('/')">← Back</button>
      <h1 class="tool-title">🧮 Scientific Calculator</h1>
    </div>
    <div class="tool-card">
      <div class="calc-display">
        <div class="calc-expr">{{ expression || '0' }}</div>
        <div class="calc-result">{{ displayResult }}</div>
      </div>
      <div class="calc-grid">
        <button class="btn-calc span2 btn-danger" @click="clear">C</button>
        <button class="btn-calc btn-danger" @click="clearEntry">CE</button>
        <button class="btn-calc btn-op" @click="append('%')">%</button>

        <button class="btn-calc btn-fn" @click="applyFn('sin(')">sin</button>
        <button class="btn-calc btn-fn" @click="applyFn('cos(')">cos</button>
        <button class="btn-calc btn-fn" @click="applyFn('tan(')">tan</button>
        <button class="btn-calc btn-op" @click="append('/')">÷</button>

        <button class="btn-calc btn-fn" @click="applyFn('asin(')">asin</button>
        <button class="btn-calc btn-fn" @click="applyFn('acos(')">acos</button>
        <button class="btn-calc btn-fn" @click="applyFn('atan(')">atan</button>
        <button class="btn-calc btn-op" @click="append('*')">×</button>

        <button class="btn-calc btn-fn" @click="applyFn('log(')">log</button>
        <button class="btn-calc btn-fn" @click="applyFn('ln(')">ln</button>
        <button class="btn-calc btn-fn" @click="applyFn('sqrt(')">√</button>
        <button class="btn-calc btn-op" @click="append('-')">−</button>

        <button class="btn-calc btn-fn" @click="append('^2')">x²</button>
        <button class="btn-calc btn-fn" @click="append('^')">xʸ</button>
        <button class="btn-calc btn-fn" @click="applyFn('fact(')">n!</button>
        <button class="btn-calc btn-op" @click="append('+')">+</button>

        <button class="btn-calc btn-fn" @click="appendConst('π')">π</button>
        <button class="btn-calc btn-fn" @click="appendConst('e')">e</button>
        <button class="btn-calc btn-fn" @click="append('1/(')">1/x</button>
        <button class="btn-calc btn-fn" @click="append('(')">(</button>

        <button class="btn-calc" @click="append('7')">7</button>
        <button class="btn-calc" @click="append('8')">8</button>
        <button class="btn-calc" @click="append('9')">9</button>
        <button class="btn-calc btn-fn" @click="append(')')">)</button>

        <button class="btn-calc" @click="append('4')">4</button>
        <button class="btn-calc" @click="append('5')">5</button>
        <button class="btn-calc" @click="append('6')">6</button>
        <button class="btn-calc btn-fn" @click="backspace">⌫</button>

        <button class="btn-calc" @click="append('1')">1</button>
        <button class="btn-calc" @click="append('2')">2</button>
        <button class="btn-calc" @click="append('3')">3</button>
        <button class="btn-calc btn-primary span1 tall" @click="calculate">=</button>

        <button class="btn-calc span2" @click="append('0')">0</button>
        <button class="btn-calc" @click="append('.')">.</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'

const expression = ref('')
const displayResult = ref('')

function append(val) {
  expression.value += val
  tryEval()
}

function applyFn(fn) {
  expression.value += fn
  tryEval()
}

function appendConst(c) {
  if (c === 'π') expression.value += '3.141592653589793'
  else if (c === 'e') expression.value += '2.718281828459045'
  tryEval()
}

function clear() {
  expression.value = ''
  displayResult.value = ''
}

function clearEntry() {
  expression.value = expression.value.slice(0, -1)
  tryEval()
}

function backspace() {
  expression.value = expression.value.slice(0, -1)
  tryEval()
}

function factorial(n) {
  if (n < 0) return NaN
  if (n === 0 || n === 1) return 1
  let r = 1
  for (let i = 2; i <= n; i++) r *= i
  return r
}

function safeEval(expr) {
  let e = expr
  e = e.replace(/\^/g, '**')
  e = e.replace(/sin\(/g, 'Math.sin(')
  e = e.replace(/cos\(/g, 'Math.cos(')
  e = e.replace(/tan\(/g, 'Math.tan(')
  e = e.replace(/asin\(/g, 'Math.asin(')
  e = e.replace(/acos\(/g, 'Math.acos(')
  e = e.replace(/atan\(/g, 'Math.atan(')
  e = e.replace(/log\(/g, 'Math.log10(')
  e = e.replace(/ln\(/g, 'Math.log(')
  e = e.replace(/sqrt\(/g, 'Math.sqrt(')
  e = e.replace(/fact\(([^)]+)\)/g, (_, n) => factorial(parseFloat(n)))
  const fn = new Function('return ' + e)
  return fn()
}

function tryEval() {
  if (!expression.value) { displayResult.value = ''; return }
  try {
    const r = safeEval(expression.value)
    if (r !== undefined && !isNaN(r) && isFinite(r)) {
      displayResult.value = '= ' + parseFloat(r.toPrecision(12))
    } else if (!isFinite(r)) {
      displayResult.value = 'Error: Division by zero'
    } else {
      displayResult.value = ''
    }
  } catch {
    displayResult.value = ''
  }
}

function calculate() {
  if (!expression.value) return
  try {
    const r = safeEval(expression.value)
    if (!isFinite(r)) {
      displayResult.value = 'Error: Division by zero'
    } else if (isNaN(r)) {
      displayResult.value = 'Error'
    } else {
      const res = parseFloat(r.toPrecision(12))
      expression.value = String(res)
      displayResult.value = ''
    }
  } catch {
    displayResult.value = 'Error: Invalid expression'
  }
}
</script>
<style scoped>
.calc-display {
  background: var(--bg-input);
  border-radius: 12px;
  padding: 16px 20px;
  text-align: right;
  margin-bottom: 16px;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border: 1.5px solid var(--border);
}
.calc-expr { font-size: 18px; color: var(--text-muted); word-break: break-all; }
.calc-result { font-size: 28px; font-weight: 700; color: var(--primary); min-height: 36px; }
.calc-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
.btn-calc {
  padding: 14px 8px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  background: var(--bg-input);
  color: var(--text);
  border: 1.5px solid var(--border);
  transition: all 0.15s;
}
.btn-calc:hover { border-color: var(--primary); color: var(--primary); background: var(--bg-card); }
.btn-op { color: var(--primary); font-size: 18px; }
.btn-fn { font-size: 13px; color: var(--text-muted); }
.btn-danger { background: #fef2f2; color: var(--error); border-color: #fca5a5; }
[data-theme="dark"] .btn-danger { background: #2d0a0a; border-color: #7f1d1d; }
.btn-primary { background: var(--primary); color: #fff; border-color: var(--primary); font-size: 20px; }
.btn-primary:hover { background: var(--primary-hover); color: #fff; }
.span2 { grid-column: span 2; }
.tall { grid-row: span 2; }
</style>
