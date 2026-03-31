import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/tools/unit-converter', component: () => import('../views/tools/UnitConverter.vue') },
  { path: '/tools/scientific-calculator', component: () => import('../views/tools/ScientificCalculator.vue') },
  { path: '/tools/color-tool', component: () => import('../views/tools/ColorTool.vue') },
  { path: '/tools/password-generator', component: () => import('../views/tools/PasswordGenerator.vue') },
  { path: '/tools/json-formatter', component: () => import('../views/tools/JsonFormatter.vue') },
  { path: '/tools/regex-tester', component: () => import('../views/tools/RegexTester.vue') },
  { path: '/tools/word-counter', component: () => import('../views/tools/WordCounter.vue') },
  { path: '/tools/markdown-previewer', component: () => import('../views/tools/MarkdownPreviewer.vue') },
  { path: '/tools/base-converter', component: () => import('../views/tools/BaseConverter.vue') },
  { path: '/tools/text-diff', component: () => import('../views/tools/TextDiff.vue') },
  { path: '/tools/case-converter', component: () => import('../views/tools/CaseConverter.vue') },
  { path: '/tools/gradient-generator', component: () => import('../views/tools/GradientGenerator.vue') },
  { path: '/tools/qr-code-generator', component: () => import('../views/tools/QrCodeGenerator.vue') },
  { path: '/tools/pomodoro-timer', component: () => import('../views/tools/PomodoroTimer.vue') },
  { path: '/tools/tip-splitter', component: () => import('../views/tools/TipSplitter.vue') },
  { path: '/tools/quadratic-solver', component: () => import('../views/tools/QuadraticSolver.vue') },
  { path: '/tools/css-box-shadow', component: () => import('../views/tools/CssBoxShadow.vue') },
  { path: '/tools/lorem-ipsum', component: () => import('../views/tools/LoremIpsum.vue') },
  { path: '/tools/url-encoder', component: () => import('../views/tools/UrlEncoder.vue') },
  { path: '/tools/image-to-base64', component: () => import('../views/tools/ImageToBase64.vue') },
  { path: '/tools/currency-converter', component: () => import('../views/tools/CurrencyConverter.vue') }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
