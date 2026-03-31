<template>
  <div class="tool-page">
    <div class="tool-header">
      <button class="back-btn" @click="$router.push('/')">← Back</button>
      <h1 class="tool-title">💱 Currency Converter</h1>
    </div>
    <div class="tool-card">
      <div v-if="loading && !currencies.length" class="loading-msg">Loading currencies...</div>
      <template v-else>
        <div class="converter-row">
          <div class="form-group flex1">
            <label>From</label>
            <select v-model="fromCurrency">
              <option v-for="c in currencyList" :key="c.code" :value="c.code">{{ c.code }} — {{ c.name }}</option>
            </select>
          </div>
          <button class="swap-btn" @click="swapCurrencies">⇄</button>
          <div class="form-group flex1">
            <label>To</label>
            <select v-model="toCurrency">
              <option v-for="c in currencyList" :key="c.code" :value="c.code">{{ c.code }} — {{ c.name }}</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Amount</label>
          <input type="number" v-model="amount" placeholder="Enter amount..." min="0" step="any" />
        </div>
        <div class="action-row">
          <button class="btn" @click="convert" :disabled="converting">{{ converting ? 'Converting...' : 'Convert' }}</button>
          <button class="btn btn-secondary" @click="clearAll">Clear</button>
        </div>
        <div v-if="error" class="error">{{ error }}</div>
        <div v-if="result !== null && !error" class="result-box">
          <div class="result-main">
            <span class="result-amount">{{ formatNumber(amount) }} {{ fromCurrency }}</span>
            <span class="result-equals">=</span>
            <span class="result-value">{{ formatNumber(result) }}</span>
            <span class="result-currency">{{ toCurrency }}</span>
          </div>
          <div class="result-rate">1 {{ fromCurrency }} = {{ formatNumber(rate) }} {{ toCurrency }}</div>
          <div class="result-date">Rate as of {{ rateDate }}</div>
          <button class="btn btn-secondary copy-btn" @click="copyResult">📋 Copy</button>
        </div>
        <div v-if="copied" class="success">Copied!</div>
        <div v-if="fetchError" class="error">{{ fetchError }}</div>
      </template>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'

const currencies = ref([])
const fromCurrency = ref('USD')
const toCurrency = ref('EUR')
const amount = ref(1)
const result = ref(null)
const rate = ref(null)
const rateDate = ref('')
const error = ref('')
const fetchError = ref('')
const loading = ref(false)
const converting = ref(false)
const copied = ref(false)

const currencyList = ref([])

function formatNumber(n) {
  if (n === null || n === undefined) return ''
  const num = parseFloat(n)
  if (isNaN(num)) return ''
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })
}

async function fetchCurrencies() {
  loading.value = true
  fetchError.value = ''
  try {
    const res = await fetch('https://api.frankfurter.dev/v2/currencies')
    if (!res.ok) throw new Error('Failed to fetch currencies')
    const data = await res.json()
    currencyList.value = Object.entries(data).map(([code, name]) => ({ code, name }))
    currencies.value = Object.keys(data)
  } catch (e) {
    fetchError.value = 'Could not load currencies. Please check your connection and try again.'
  } finally {
    loading.value = false
  }
}

async function convert() {
  error.value = ''
  result.value = null
  rate.value = null
  rateDate.value = ''

  if (amount.value === '' || amount.value === null || amount.value === undefined) {
    error.value = 'Please enter an amount'
    return
  }

  const val = parseFloat(amount.value)
  if (isNaN(val) || val < 0) {
    error.value = 'Please enter a valid non-negative number'
    return
  }

  if (fromCurrency.value === toCurrency.value) {
    result.value = val
    rate.value = 1
    rateDate.value = new Date().toISOString().split('T')[0]
    return
  }

  converting.value = true
  try {
    const url = `https://api.frankfurter.dev/v2/rates?base=${fromCurrency.value}&quotes=${toCurrency.value}`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Conversion failed')
    const data = await res.json()
    const fetchedRate = data.rates && data.rates[toCurrency.value]
    if (!fetchedRate) throw new Error('Rate not found')
    rate.value = fetchedRate
    result.value = rate.value * val
    rateDate.value = data.date
  } catch (e) {
    error.value = 'Could not convert. Please check your connection and try again.'
  } finally {
    converting.value = false
  }
}

function swapCurrencies() {
  const tmp = fromCurrency.value
  fromCurrency.value = toCurrency.value
  toCurrency.value = tmp
  if (result.value !== null) {
    convert()
  }
}

function clearAll() {
  amount.value = 1
  result.value = null
  rate.value = null
  rateDate.value = ''
  error.value = ''
}

async function copyResult() {
  if (result.value === null) return
  const text = `${formatNumber(amount.value)} ${fromCurrency.value} = ${formatNumber(result.value)} ${toCurrency.value}`
  await navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

onMounted(() => {
  fetchCurrencies()
})
</script>
<style scoped>
.converter-row {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  margin-bottom: 16px;
}
.flex1 { flex: 1; margin-bottom: 0; }
.swap-btn {
  padding: 10px 14px;
  background: var(--bg-input);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  font-size: 18px;
  color: var(--text);
  flex-shrink: 0;
  margin-bottom: 0;
  height: 42px;
}
.swap-btn:hover { border-color: var(--primary); color: var(--primary); }
.result-box {
  margin-top: 20px;
  padding: 20px;
  background: var(--bg-input);
  border-radius: 12px;
  border: 1.5px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.result-main {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
}
.result-amount { font-size: 16px; color: var(--text-muted); }
.result-equals { font-size: 18px; color: var(--text-muted); }
.result-value { font-size: 28px; font-weight: 800; color: var(--primary); }
.result-currency { font-size: 16px; color: var(--text-muted); }
.result-rate { font-size: 13px; color: var(--text-muted); }
.result-date { font-size: 12px; color: var(--text-muted); }
.copy-btn { padding: 8px 14px; font-size: 13px; align-self: flex-start; }
.loading-msg {
  text-align: center;
  padding: 40px;
  color: var(--text-muted);
  font-size: 16px;
}
@media (max-width: 600px) {
  .converter-row { flex-direction: column; }
  .swap-btn { width: 100%; }
  .result-main { flex-direction: column; gap: 4px; }
}
</style>
