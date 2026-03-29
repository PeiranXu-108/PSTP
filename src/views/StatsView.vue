<template>
  <div class="stats-view">
    <h1 class="stats-title">数据统计</h1>

    <div v-if="history.length === 0" class="empty-state">
      <div class="empty-icon">📊</div>
      <p>还没有测试记录</p>
      <el-button type="primary" round @click="$router.push('/')">去测试一下</el-button>
    </div>

    <template v-else>
      <div class="stats-summary">
        <div class="stat-card">
          <span class="stat-num">{{ history.length }}</span>
          <span class="stat-label">测试总次数</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ avgEconomic > 0 ? '+' : '' }}{{ avgEconomic }}</span>
          <span class="stat-label">平均经济分数</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ avgAuth > 0 ? '+' : '' }}{{ avgAuth }}</span>
          <span class="stat-label">平均权威分数</span>
        </div>
      </div>

      <div class="charts-grid">
        <div class="chart-card">
          <h3>历史分布散点图</h3>
          <div ref="scatterRef" class="chart-area"></div>
        </div>
        <div class="chart-card">
          <h3>象限分布</h3>
          <div ref="pieRef" class="chart-area"></div>
        </div>
      </div>

      <div class="history-table">
        <h3>历史记录</h3>
        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>经济分数</th>
                <th>权威分数</th>
                <th>象限</th>
                <th>时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in sortedHistory" :key="item.timestamp">
                <td>{{ sortedHistory.length - i }}</td>
                <td>{{ item.economicScore > 0 ? '+' : '' }}{{ item.economicScore }}</td>
                <td>{{ item.authoritarianScore > 0 ? '+' : '' }}{{ item.authoritarianScore }}</td>
                <td>
                  <span class="q-tag" :style="{ color: getColor(item) }">
                    {{ getQName(item) }}
                  </span>
                </td>
                <td>{{ formatTime(item.timestamp) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useStore } from 'vuex'
import * as echarts from 'echarts'
import { quadrants, getQuadrantKey } from '../data/ideologies.js'

const store = useStore()

const history = computed(() => store.state.history)
const sortedHistory = computed(() => [...history.value].reverse())

const avgEconomic = computed(() => {
  if (!history.value.length) return 0
  return Math.round(history.value.reduce((s, h) => s + h.economicScore, 0) / history.value.length)
})

const avgAuth = computed(() => {
  if (!history.value.length) return 0
  return Math.round(history.value.reduce((s, h) => s + h.authoritarianScore, 0) / history.value.length)
})

function getQName(item) {
  const key = getQuadrantKey(item.economicScore, item.authoritarianScore)
  return quadrants[key].name
}

function getColor(item) {
  const key = getQuadrantKey(item.economicScore, item.authoritarianScore)
  return quadrants[key].color
}

function formatTime(ts) {
  return new Date(ts).toLocaleString('zh-CN', {
    month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

const scatterRef = ref(null)
const pieRef = ref(null)
let scatterChart = null
let pieChart = null
let resizeObserver = null

function renderCharts() {
  if (!history.value.length) return

  if (scatterRef.value) {
    if (!scatterChart) scatterChart = echarts.init(scatterRef.value)
    const data = history.value.map(h => {
      const key = getQuadrantKey(h.economicScore, h.authoritarianScore)
      return { value: [h.economicScore, h.authoritarianScore], itemStyle: { color: quadrants[key].color } }
    })
    scatterChart.setOption({
      backgroundColor: 'transparent',
      grid: { left: 50, right: 30, top: 20, bottom: 50 },
      xAxis: {
        type: 'value', min: -100, max: 100,
        axisLine: { lineStyle: { color: '#334155' } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { color: '#64748b', formatter: v => v === -100 ? '左' : v === 100 ? '右' : v === 0 ? '0' : '' },
      },
      yAxis: {
        type: 'value', min: -100, max: 100,
        axisLine: { lineStyle: { color: '#334155' } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { color: '#64748b', formatter: v => v === -100 ? '自由' : v === 100 ? '威权' : v === 0 ? '0' : '' },
      },
      series: [
        {
          type: 'scatter', symbolSize: 0, data: [],
          markArea: {
            silent: true,
            data: [
              [{ xAxis: -100, yAxis: 0, itemStyle: { color: '#ef444415' } }, { xAxis: 0, yAxis: 100 }],
              [{ xAxis: 0, yAxis: 0, itemStyle: { color: '#3b82f615' } }, { xAxis: 100, yAxis: 100 }],
              [{ xAxis: -100, yAxis: -100, itemStyle: { color: '#22c55e15' } }, { xAxis: 0, yAxis: 0 }],
              [{ xAxis: 0, yAxis: -100, itemStyle: { color: '#eab30815' } }, { xAxis: 100, yAxis: 0 }],
            ],
          },
          markLine: {
            silent: true, symbol: 'none',
            lineStyle: { color: '#475569', type: 'solid', width: 1 },
            data: [{ xAxis: 0 }, { yAxis: 0 }],
            label: { show: false },
          },
        },
        { type: 'scatter', symbolSize: 12, data },
      ],
    })
  }

  if (pieRef.value) {
    if (!pieChart) pieChart = echarts.init(pieRef.value)
    const counts = { 'left-authoritarian': 0, 'right-authoritarian': 0, 'left-libertarian': 0, 'right-libertarian': 0 }
    history.value.forEach(h => {
      counts[getQuadrantKey(h.economicScore, h.authoritarianScore)]++
    })
    pieChart.setOption({
      backgroundColor: 'transparent',
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: true,
        itemStyle: { borderColor: '#1e293b', borderWidth: 2, borderRadius: 6 },
        label: { color: '#94a3b8', fontSize: 12 },
        data: Object.entries(counts)
          .filter(([, v]) => v > 0)
          .map(([key, value]) => ({
            name: quadrants[key].name,
            value,
            itemStyle: { color: quadrants[key].color },
          })),
      }],
    })
  }
}

onMounted(() => {
  renderCharts()
  resizeObserver = new ResizeObserver(() => {
    scatterChart?.resize()
    pieChart?.resize()
  })
  if (scatterRef.value) resizeObserver.observe(scatterRef.value)
  if (pieRef.value) resizeObserver.observe(pieRef.value)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  scatterChart?.dispose()
  pieChart?.dispose()
})

watch(history, () => renderCharts(), { deep: true })
</script>

<style scoped>
.stats-view {
  max-width: 900px;
  margin: 0 auto;
}

.stats-title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 32px;
  background: linear-gradient(135deg, #6366f1, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state p {
  color: var(--color-text-secondary);
  margin-bottom: 20px;
}

.stats-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.stat-num {
  display: block;
  font-size: 28px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.chart-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 20px;
}

.chart-card h3 {
  font-size: 15px;
  margin-bottom: 12px;
}

.chart-area {
  width: 100%;
  height: 320px;
}

.history-table {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 20px;
}

.history-table h3 {
  font-size: 15px;
  margin-bottom: 16px;
}

.table-scroll {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th, td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

th {
  color: var(--color-text-secondary);
  font-weight: 500;
  font-size: 13px;
}

.q-tag {
  font-weight: 600;
  font-size: 13px;
}

@media (max-width: 768px) {
  .stats-summary {
    grid-template-columns: 1fr;
  }
  .charts-grid {
    grid-template-columns: 1fr;
  }
  .chart-area {
    height: 280px;
  }
}
</style>
