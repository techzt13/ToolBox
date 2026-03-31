<template>
  <div class="tool-page">
    <div class="tool-header">
      <button class="back-btn" @click="$router.push('/')">← Back</button>
      <h1 class="tool-title">📏 Unit Converter</h1>
    </div>
    <div class="tool-card">
      <div class="form-group">
        <label>Category</label>
        <select v-model="category" @change="resetUnits">
          <option v-for="c in Object.keys(unitCategories)" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <div class="converter-row">
        <div class="form-group flex1">
          <label>From</label>
          <select v-model="fromUnit">
            <option v-for="u in currentUnits" :key="u.id" :value="u.id">{{ u.label }}</option>
          </select>
        </div>
        <button class="swap-btn" @click="swapUnits">⇄</button>
        <div class="form-group flex1">
          <label>To</label>
          <select v-model="toUnit">
            <option v-for="u in currentUnits" :key="u.id" :value="u.id">{{ u.label }}</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label>Value</label>
        <input type="number" v-model="inputValue" placeholder="Enter value..." />
      </div>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="result !== null && !error" class="result-box">
        <span class="result-value">{{ result }}</span>
        <span class="result-unit">{{ toUnitLabel }}</span>
        <button class="btn btn-secondary copy-btn" @click="copyResult">📋 Copy</button>
      </div>
      <div v-if="copied" class="success">Copied!</div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'

const unitCategories = {
  Length: [
    { id: 'm', label: 'Meter (m)', toBase: v => v, fromBase: v => v },
    { id: 'km', label: 'Kilometer (km)', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { id: 'cm', label: 'Centimeter (cm)', toBase: v => v / 100, fromBase: v => v * 100 },
    { id: 'mm', label: 'Millimeter (mm)', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { id: 'mi', label: 'Mile (mi)', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
    { id: 'yd', label: 'Yard (yd)', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
    { id: 'ft', label: 'Foot (ft)', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
    { id: 'in', label: 'Inch (in)', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
    { id: 'nm', label: 'Nanometer (nm)', toBase: v => v / 1e9, fromBase: v => v * 1e9 },
    { id: 'um', label: 'Micrometer (µm)', toBase: v => v / 1e6, fromBase: v => v * 1e6 }
  ],
  Weight: [
    { id: 'kg', label: 'Kilogram (kg)', toBase: v => v, fromBase: v => v },
    { id: 'g', label: 'Gram (g)', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { id: 'mg', label: 'Milligram (mg)', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
    { id: 'lb', label: 'Pound (lb)', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
    { id: 'oz', label: 'Ounce (oz)', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
    { id: 't', label: 'Metric ton (t)', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { id: 'stone', label: 'Stone', toBase: v => v * 6.35029, fromBase: v => v / 6.35029 }
  ],
  Temperature: [
    { id: 'c', label: 'Celsius (°C)', toBase: v => v, fromBase: v => v },
    { id: 'f', label: 'Fahrenheit (°F)', toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
    { id: 'k', label: 'Kelvin (K)', toBase: v => v - 273.15, fromBase: v => v + 273.15 }
  ],
  Volume: [
    { id: 'l', label: 'Liter (L)', toBase: v => v, fromBase: v => v },
    { id: 'ml', label: 'Milliliter (mL)', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { id: 'm3', label: 'Cubic meter (m³)', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { id: 'cm3', label: 'Cubic centimeter (cm³)', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { id: 'ft3', label: 'Cubic foot (ft³)', toBase: v => v * 28.3168, fromBase: v => v / 28.3168 },
    { id: 'in3', label: 'Cubic inch (in³)', toBase: v => v * 0.0163871, fromBase: v => v / 0.0163871 },
    { id: 'gal', label: 'Gallon (US)', toBase: v => v * 3.78541, fromBase: v => v / 3.78541 },
    { id: 'qt', label: 'Quart (US)', toBase: v => v * 0.946353, fromBase: v => v / 0.946353 },
    { id: 'pt', label: 'Pint (US)', toBase: v => v * 0.473176, fromBase: v => v / 0.473176 },
    { id: 'floz', label: 'Fluid ounce (fl oz)', toBase: v => v * 0.0295735, fromBase: v => v / 0.0295735 },
    { id: 'cup', label: 'Cup (US)', toBase: v => v * 0.236588, fromBase: v => v / 0.236588 }
  ],
  Area: [
    { id: 'm2', label: 'Square meter (m²)', toBase: v => v, fromBase: v => v },
    { id: 'km2', label: 'Square kilometer (km²)', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
    { id: 'cm2', label: 'Square centimeter (cm²)', toBase: v => v / 1e4, fromBase: v => v * 1e4 },
    { id: 'mm2', label: 'Square millimeter (mm²)', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
    { id: 'ha', label: 'Hectare (ha)', toBase: v => v * 1e4, fromBase: v => v / 1e4 },
    { id: 'acre', label: 'Acre', toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
    { id: 'ft2', label: 'Square foot (ft²)', toBase: v => v * 0.092903, fromBase: v => v / 0.092903 },
    { id: 'in2', label: 'Square inch (in²)', toBase: v => v * 0.00064516, fromBase: v => v / 0.00064516 },
    { id: 'yd2', label: 'Square yard (yd²)', toBase: v => v * 0.836127, fromBase: v => v / 0.836127 },
    { id: 'mi2', label: 'Square mile (mi²)', toBase: v => v * 2.59e6, fromBase: v => v / 2.59e6 }
  ],
  Time: [
    { id: 's', label: 'Second (s)', toBase: v => v, fromBase: v => v },
    { id: 'ms', label: 'Millisecond (ms)', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { id: 'us', label: 'Microsecond (µs)', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
    { id: 'min', label: 'Minute (min)', toBase: v => v * 60, fromBase: v => v / 60 },
    { id: 'h', label: 'Hour (h)', toBase: v => v * 3600, fromBase: v => v / 3600 },
    { id: 'day', label: 'Day', toBase: v => v * 86400, fromBase: v => v / 86400 },
    { id: 'week', label: 'Week', toBase: v => v * 604800, fromBase: v => v / 604800 },
    { id: 'month', label: 'Month (avg)', toBase: v => v * 2629800, fromBase: v => v / 2629800 },
    { id: 'year', label: 'Year', toBase: v => v * 31557600, fromBase: v => v / 31557600 }
  ],
  Speed: [
    { id: 'ms', label: 'm/s', toBase: v => v, fromBase: v => v },
    { id: 'kmh', label: 'km/h', toBase: v => v / 3.6, fromBase: v => v * 3.6 },
    { id: 'mph', label: 'mph', toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
    { id: 'knot', label: 'Knot', toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
    { id: 'fts', label: 'ft/s', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 }
  ]
}

const category = ref('Length')
const inputValue = ref('')
const error = ref('')
const copied = ref(false)

const currentUnits = computed(() => unitCategories[category.value])

const fromUnit = ref(currentUnits.value[0].id)
const toUnit = ref(currentUnits.value[1].id)

function resetUnits() {
  const units = unitCategories[category.value]
  fromUnit.value = units[0].id
  toUnit.value = units[1].id
  inputValue.value = ''
  error.value = ''
}

function swapUnits() {
  const tmp = fromUnit.value
  fromUnit.value = toUnit.value
  toUnit.value = tmp
}

const toUnitLabel = computed(() => {
  const u = currentUnits.value.find(u => u.id === toUnit.value)
  return u ? u.label : ''
})

const result = computed(() => {
  if (inputValue.value === '' || inputValue.value === null) return null
  const val = parseFloat(inputValue.value)
  if (isNaN(val)) { error.value = 'Please enter a valid number'; return null }
  error.value = ''
  const fromU = currentUnits.value.find(u => u.id === fromUnit.value)
  const toU = currentUnits.value.find(u => u.id === toUnit.value)
  if (!fromU || !toU) return null
  const base = fromU.toBase(val)
  const res = toU.fromBase(base)
  return parseFloat(res.toPrecision(10))
})

async function copyResult() {
  if (result.value === null) return
  await navigator.clipboard.writeText(String(result.value))
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
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
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 20px;
  padding: 20px;
  background: var(--bg-input);
  border-radius: 12px;
  border: 1.5px solid var(--border);
}
.result-value { font-size: 28px; font-weight: 800; color: var(--primary); }
.result-unit { font-size: 16px; color: var(--text-muted); flex: 1; }
.copy-btn { padding: 8px 14px; font-size: 13px; }
@media (max-width: 600px) {
  .converter-row { flex-direction: column; }
  .swap-btn { width: 100%; }
}
</style>
