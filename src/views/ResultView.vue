<template>
  <div class="result-view">

    <div class="result-header">
      <div class="result-badge">测试结果</div>
      <h1 class="result-title">你的政治光谱坐标</h1>
      <p class="result-sub">基于本次测试中随机抽取的 40 道题的加权评分，你被定位在以下位置</p>
    </div>

    <!-- Chart -->
    <div class="chart-card">
      <PoliticalChart
        :economic-score="result.economicScore"
        :authoritarian-score="result.authoritarianScore"
      />
    </div>

    <!-- Explanation -->
    <QuadrantExplain
      :economic-score="result.economicScore"
      :authoritarian-score="result.authoritarianScore"
    />

    <!-- Actions -->
    <div class="actions">
      <button class="btn btn-primary" @click="downloadPoster" :disabled="generating" aria-label="下载结果海报">
        <svg v-if="!generating" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg v-else class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="2" opacity=".25"/>
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        {{ generating ? '生成中…' : '下载结果海报' }}
      </button>

      <button class="btn btn-secondary" @click="$router.push('/stats')" aria-label="查看数据统计">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        查看统计
      </button>

      <button class="btn btn-ghost" @click="retakeTest" aria-label="重新测试">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        重新测试
      </button>
    </div>

    <!-- Offscreen poster -->
    <div class="poster-offscreen" ref="posterRef">
      <div class="poster-inner">
        <div class="poster-head">
          <div class="poster-logo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#2563eb" stroke-width="2"/>
              <line x1="12" y1="3" x2="12" y2="21" stroke="#2563eb" stroke-width="2"/>
              <line x1="3" y1="12" x2="21" y2="12" stroke="#2563eb" stroke-width="2"/>
            </svg>
            <span>政治光谱测试</span>
          </div>
        </div>
        <div class="poster-chart-wrap" ref="posterChartRef"></div>
        <div class="poster-scores">
          <div class="poster-score">
            <span>经济</span>
            <strong :style="{ color: result.economicScore <= 0 ? '#dc2626' : '#1d4ed8' }">
              {{ result.economicScore > 0 ? '+' : '' }}{{ result.economicScore }}
            </strong>
          </div>
          <div class="poster-score-sep"></div>
          <div class="poster-score">
            <span>权威</span>
            <strong :style="{ color: result.authoritarianScore >= 0 ? '#7c3aed' : '#16a34a' }">
              {{ result.authoritarianScore > 0 ? '+' : '' }}{{ result.authoritarianScore }}
            </strong>
          </div>
        </div>
        <div class="poster-quadrant" :style="{ color: currentQuadrant.color }">
          {{ currentQuadrant.name }}
        </div>
        <div class="poster-footer">
          <span>政治光谱测试 · 仅供参考</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import html2canvas from 'html2canvas'
import PoliticalChart from '../components/PoliticalChart.vue'
import QuadrantExplain from '../components/QuadrantExplain.vue'
import { quadrants, getQuadrantKey } from '../data/ideologies.js'

const store = useStore()
const router = useRouter()

const result = computed(() => store.state.result || { economicScore: 0, authoritarianScore: 0 })
const currentQuadrant = computed(() => quadrants[getQuadrantKey(result.value.economicScore, result.value.authoritarianScore)])

const posterRef = ref(null)
const posterChartRef = ref(null)
const generating = ref(false)

function buildPosterChartOption() {
  const { economicScore: ex, authoritarianScore: ay } = result.value
  return {
    backgroundColor: '#ffffff',
    grid: { left: 50, right: 28, top: 28, bottom: 48 },
    xAxis: {
      type: 'value', min: -100, max: 100,
      axisLine: { lineStyle: { color: '#cbd5e1', width: 1.5 } },
      axisTick: { show: false }, splitLine: { show: false },
      axisLabel: { color: '#94a3b8', fontSize: 9,
        formatter: v => v === -100 ? '国家干预' : v === 100 ? '市场自由' : '' },
    },
    yAxis: {
      type: 'value', min: -100, max: 100,
      axisLine: { lineStyle: { color: '#cbd5e1', width: 1.5 } },
      axisTick: { show: false }, splitLine: { show: false },
      axisLabel: { color: '#94a3b8', fontSize: 9,
        formatter: v => v === -100 ? '个人自由' : v === 100 ? '社会秩序' : '' },
    },
    series: [
      {
        type: 'scatter', symbolSize: 0, data: [],
        markArea: { silent: true, data: [
          [{ xAxis: -100, yAxis:    0, itemStyle: { color: '#fef2f2' } }, { xAxis: 0, yAxis: 100 }],
          [{ xAxis:    0, yAxis:    0, itemStyle: { color: '#eff6ff' } }, { xAxis: 100, yAxis: 100 }],
          [{ xAxis: -100, yAxis: -100, itemStyle: { color: '#f0fdf4' } }, { xAxis: 0, yAxis: 0 }],
          [{ xAxis:    0, yAxis: -100, itemStyle: { color: '#fffbeb' } }, { xAxis: 100, yAxis: 0 }],
        ]},
        markLine: {
          silent: true, symbol: 'none',
          lineStyle: { color: '#cbd5e1', type: 'solid', width: 1.5 },
          data: [{ xAxis: 0 }, { yAxis: 0 }], label: { show: false },
        },
      },
      {
        type: 'scatter', symbolSize: 14,
        itemStyle: { color: '#dc2626', borderColor: '#fff', borderWidth: 2, shadowBlur: 6, shadowColor: 'rgba(220,38,38,.3)' },
        data: [[ex, ay]], z: 10,
      },
    ],
  }
}

async function downloadPoster() {
  generating.value = true
  try {
    await nextTick()
    if (posterChartRef.value) {
      const pc = echarts.init(posterChartRef.value)
      pc.setOption(buildPosterChartOption())
      await new Promise(r => setTimeout(r, 400))
    }
    const canvas = await html2canvas(posterRef.value, {
      backgroundColor: '#f8fafc',
      scale: 2,
      useCORS: true,
    })
    const link = document.createElement('a')
    link.download = `政治光谱_${result.value.economicScore}_${result.value.authoritarianScore}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } finally {
    generating.value = false
  }
}

function retakeTest() {
  store.dispatch('startNewTest')
  router.push('/test')
}
</script>

<style scoped>
.result-view {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.result-header { text-align: center; padding: 8px 0; }

.result-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--success);
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 20px;
  padding: 3px 12px;
  margin-bottom: 12px;
}

.result-title {
  font-size: 30px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -.01em;
  margin-bottom: 6px;
}

.result-sub {
  font-size: 14px;
  color: var(--text-3);
}

.chart-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  box-shadow: var(--shadow-sm);
}

/* Actions */
.actions {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  padding-bottom: 40px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  border-radius: var(--radius-sm);
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: var(--transition);
}

.btn:disabled { opacity: .5; cursor: not-allowed; }

.btn-primary { background: var(--primary); color: #fff; box-shadow: 0 1px 3px rgba(37,99,235,.18); }
.btn-primary:not(:disabled):hover { background: var(--primary-hover); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37,99,235,.25); }

.btn-secondary { background: var(--bg-card); color: var(--text); border: 1px solid var(--border); box-shadow: var(--shadow-sm); }
.btn-secondary:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-light); }

.btn-ghost { background: transparent; color: var(--text-2); border: 1px solid var(--border); }
.btn-ghost:hover { background: var(--bg-subtle); color: var(--text); }

.spin { animation: spin 0.9s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Poster (offscreen) */
.poster-offscreen {
  position: fixed;
  left: -9999px;
  top: 0;
  width: 380px;
  pointer-events: none;
}

.poster-inner {
  width: 380px;
  background: #f8fafc;
  padding: 28px 24px;
  font-family: 'Inter', 'PingFang SC', sans-serif;
  color: #0f172a;
}

.poster-head { margin-bottom: 16px; }

.poster-logo {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}

.poster-chart-wrap {
  width: 332px;
  height: 280px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-bottom: 16px;
}

.poster-scores {
  display: flex;
  align-items: stretch;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
}

.poster-score {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  gap: 2px;
}

.poster-score span {
  font-size: 10px;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
}

.poster-score strong {
  font-size: 26px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.poster-score-sep { width: 1px; background: #e2e8f0; }

.poster-quadrant {
  text-align: center;
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 16px;
}

.poster-footer {
  text-align: center;
  font-size: 10px;
  color: #94a3b8;
  border-top: 1px solid #e2e8f0;
  padding-top: 12px;
}

@media (max-width: 640px) {
  .result-title { font-size: 22px; }
  .actions { flex-direction: column; align-items: center; }
  .actions .btn { width: 100%; justify-content: center; }
}

@media (prefers-reduced-motion: reduce) {
  .spin { animation: none; }
}
</style>
