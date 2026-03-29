<template>
  <div class="result-view">
    <h1 class="result-title">你的政治光谱</h1>

    <div class="chart-container" ref="posterArea">
      <PoliticalChart
        :economic-score="result.economicScore"
        :authoritarian-score="result.authoritarianScore"
      />
    </div>

    <QuadrantExplain
      :economic-score="result.economicScore"
      :authoritarian-score="result.authoritarianScore"
    />

    <div class="actions">
      <el-button type="primary" size="large" round @click="downloadPoster" :loading="generating">
        下载结果海报
      </el-button>
      <el-button size="large" round @click="$router.push('/stats')">
        查看数据统计
      </el-button>
      <el-button size="large" round @click="retakeTest">
        重新测试
      </el-button>
    </div>

    <div class="poster-offscreen" ref="posterRef">
      <div class="poster-inner">
        <div class="poster-header">
          <h2>我的政治光谱</h2>
          <p class="poster-subtitle">Political Spectrum Test</p>
        </div>
        <div class="poster-chart" ref="posterChartRef"></div>
        <div class="poster-scores">
          <div class="poster-score-item">
            <span>经济维度</span>
            <strong>{{ result.economicScore > 0 ? '+' : '' }}{{ result.economicScore }}</strong>
          </div>
          <div class="poster-score-item">
            <span>权威维度</span>
            <strong>{{ result.authoritarianScore > 0 ? '+' : '' }}{{ result.authoritarianScore }}</strong>
          </div>
        </div>
        <div class="poster-quadrant" :style="{ color: currentQuadrant.color }">
          {{ currentQuadrant.name }}
        </div>
        <div class="poster-footer">
          <p>扫描二维码或搜索 "政治光谱测试" 开始你的测试</p>
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
const currentQuadrant = computed(() => {
  const key = getQuadrantKey(result.value.economicScore, result.value.authoritarianScore)
  return quadrants[key]
})

const posterRef = ref(null)
const posterChartRef = ref(null)
const generating = ref(false)

function buildPosterChartOption(ecoScore, authScore) {
  return {
    backgroundColor: '#1e293b',
    grid: { left: 50, right: 30, top: 30, bottom: 50 },
    xAxis: {
      type: 'value', min: -100, max: 100,
      axisLine: { lineStyle: { color: '#475569' } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: {
        color: '#94a3b8', fontSize: 10,
        formatter: v => v === -100 ? '国家干预' : v === 100 ? '市场自由' : '',
      },
    },
    yAxis: {
      type: 'value', min: -100, max: 100,
      axisLine: { lineStyle: { color: '#475569' } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: {
        color: '#94a3b8', fontSize: 10,
        formatter: v => v === -100 ? '个人自由' : v === 100 ? '社会秩序' : '',
      },
    },
    series: [
      {
        type: 'scatter', symbolSize: 0, data: [],
        markArea: {
          silent: true,
          data: [
            [{ xAxis: -100, yAxis: 0, itemStyle: { color: '#ef444425' } }, { xAxis: 0, yAxis: 100 }],
            [{ xAxis: 0, yAxis: 0, itemStyle: { color: '#3b82f625' } }, { xAxis: 100, yAxis: 100 }],
            [{ xAxis: -100, yAxis: -100, itemStyle: { color: '#22c55e25' } }, { xAxis: 0, yAxis: 0 }],
            [{ xAxis: 0, yAxis: -100, itemStyle: { color: '#eab30825' } }, { xAxis: 100, yAxis: 0 }],
          ],
        },
        markLine: {
          silent: true, symbol: 'none',
          lineStyle: { color: '#475569', type: 'solid', width: 1 },
          data: [{ xAxis: 0 }, { yAxis: 0 }],
          label: { show: false },
        },
      },
      {
        type: 'scatter', symbolSize: 14,
        itemStyle: { color: '#f43f5e', borderColor: '#fff', borderWidth: 2, shadowBlur: 8, shadowColor: '#f43f5e88' },
        data: [[ecoScore, authScore]],
        z: 10,
      },
    ],
  }
}

async function downloadPoster() {
  generating.value = true
  try {
    await nextTick()

    if (posterChartRef.value) {
      const pChart = echarts.init(posterChartRef.value)
      pChart.setOption(buildPosterChartOption(result.value.economicScore, result.value.authoritarianScore))
      await new Promise(r => setTimeout(r, 300))
    }

    const canvas = await html2canvas(posterRef.value, {
      backgroundColor: '#0f172a',
      scale: 2,
      useCORS: true,
    })

    const link = document.createElement('a')
    link.download = `政治光谱测试结果_${Date.now()}.png`
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
}

.result-title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #6366f1, #a78bfa, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.chart-container {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 32px;
  padding-bottom: 40px;
}

/* Poster (offscreen for html2canvas) */
.poster-offscreen {
  position: fixed;
  left: -9999px;
  top: 0;
  width: 375px;
}

.poster-inner {
  width: 375px;
  background: #0f172a;
  padding: 32px 24px;
  color: #f1f5f9;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

.poster-header {
  text-align: center;
  margin-bottom: 16px;
}

.poster-header h2 {
  font-size: 22px;
  margin-bottom: 4px;
}

.poster-subtitle {
  font-size: 12px;
  color: #94a3b8;
}

.poster-chart {
  width: 327px;
  height: 300px;
  margin: 0 auto 16px;
}

.poster-scores {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 12px;
}

.poster-score-item {
  text-align: center;
}

.poster-score-item span {
  font-size: 11px;
  color: #94a3b8;
  display: block;
  margin-bottom: 2px;
}

.poster-score-item strong {
  font-size: 20px;
  font-weight: 700;
}

.poster-quadrant {
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
}

.poster-footer {
  text-align: center;
  border-top: 1px solid #334155;
  padding-top: 16px;
}

.poster-footer p {
  font-size: 11px;
  color: #64748b;
}

@media (max-width: 640px) {
  .result-title {
    font-size: 22px;
  }
  .actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
