<template>
  <div class="tool-page">
    <div class="tool-header">
      <button class="back-btn" @click="$router.push('/')">← Back</button>
      <h1 class="tool-title">⏱️ Pomodoro Timer</h1>
    </div>
    <div class="pomodoro-center">
      <div class="phase-label">{{ phaseLabel }}</div>
      <div class="session-count">Session {{ currentSession }} of 4</div>
      <div class="ring-wrap">
        <svg class="ring-svg" viewBox="0 0 200 200">
          <circle class="ring-bg" cx="100" cy="100" r="88" />
          <circle class="ring-fg" cx="100" cy="100" r="88"
            :stroke-dasharray="ringCircumference"
            :stroke-dashoffset="ringOffset"
            :stroke="ringColor"
          />
        </svg>
        <div class="timer-display">{{ timerDisplay }}</div>
      </div>
      <div class="action-row" style="justify-content:center">
        <button class="btn" @click="toggleTimer">{{ running ? '⏸ Pause' : '▶ Start' }}</button>
        <button class="btn btn-secondary" @click="resetTimer">↺ Reset</button>
      </div>
    </div>
    <div class="settings-grid tool-card" style="margin-top:24px">
      <div class="form-group">
        <label>Focus (min)</label>
        <input type="number" v-model.number="focusDuration" min="1" max="120" @change="resetTimer" />
      </div>
      <div class="form-group">
        <label>Short Break (min)</label>
        <input type="number" v-model.number="shortBreak" min="1" max="60" @change="resetTimer" />
      </div>
      <div class="form-group">
        <label>Long Break (min)</label>
        <input type="number" v-model.number="longBreak" min="1" max="120" @change="resetTimer" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onUnmounted } from 'vue'

const focusDuration = ref(25)
const shortBreak = ref(5)
const longBreak = ref(15)
const phases = ['focus', 'short', 'short', 'short', 'short', 'long']

const currentSession = ref(1)
const phaseIndex = ref(0)
const running = ref(false)
let interval = null

function phaseSeconds() {
  const p = phaseIndex.value % 2 === 0 ? 'focus' : (currentSession.value % 4 === 0 ? 'long' : 'short')
  if (p === 'focus') return focusDuration.value * 60
  if (p === 'short') return shortBreak.value * 60
  return longBreak.value * 60
}

const totalSecs = ref(focusDuration.value * 60)
const remaining = ref(totalSecs.value)

const phaseLabel = computed(() => {
  if (phaseIndex.value % 2 === 0) return '🎯 Focus'
  return currentSession.value % 4 === 0 ? '🌴 Long Break' : '☕ Short Break'
})

const timerDisplay = computed(() => {
  const m = Math.floor(remaining.value / 60).toString().padStart(2, '0')
  const s = (remaining.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

const ringCircumference = 2 * Math.PI * 88
const ringOffset = computed(() => ringCircumference * (1 - remaining.value / totalSecs.value))
const ringColor = computed(() => phaseIndex.value % 2 === 0 ? '#2563eb' : '#22c55e')

function toggleTimer() {
  if (running.value) {
    clearInterval(interval)
    running.value = false
  } else {
    running.value = true
    interval = setInterval(tick, 1000)
  }
}

function tick() {
  if (remaining.value <= 0) {
    clearInterval(interval)
    running.value = false
    beep()
    nextPhase()
    return
  }
  remaining.value--
}

function nextPhase() {
  phaseIndex.value++
  if (phaseIndex.value % 2 === 0) {
    currentSession.value++
    if (currentSession.value > 4) { currentSession.value = 1 }
  }
  totalSecs.value = phaseSeconds()
  remaining.value = totalSecs.value
}

function resetTimer() {
  clearInterval(interval)
  running.value = false
  phaseIndex.value = 0
  currentSession.value = 1
  totalSecs.value = focusDuration.value * 60
  remaining.value = totalSecs.value
}

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.8)
  } catch {}
}

onUnmounted(() => clearInterval(interval))
</script>
<style scoped>
.pomodoro-center { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 32px 0; }
.phase-label { font-size: 22px; font-weight: 700; }
.session-count { font-size: 14px; color: var(--text-muted); }
.ring-wrap { position: relative; width: 200px; height: 200px; }
.ring-svg { width: 200px; height: 200px; transform: rotate(-90deg); }
.ring-bg { fill: none; stroke: var(--border); stroke-width: 12; }
.ring-fg { fill: none; stroke-width: 12; stroke-linecap: round; transition: stroke-dashoffset 0.5s; }
.timer-display { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 40px; font-weight: 800; color: var(--text); letter-spacing: -1px; }
.settings-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
@media (max-width: 500px) { .settings-grid { grid-template-columns: 1fr; } }
</style>
