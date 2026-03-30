<template>
  <div class="stats-view">

    <div class="stats-header">
      <h1 class="stats-title">数据统计</h1>
      <p class="stats-sub">来自本设备的所有历史测试记录</p>
    </div>

    <!-- Empty state -->
    <div v-if="history.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M18 20V10M12 20V4M6 20v-6" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <p>还没有测试记录</p>
      <button class="btn btn-primary" @click="$router.push('/')" aria-label="去首页开始测试">开始测试</button>
    </div>

    <template v-else>
      <!-- Summary cards -->
      <div class="summary-grid">
        <div class="summary-card">
          <div class="summary-num">{{ history.length }}</div>
          <div class="summary-label">测试次数</div>
        </div>
        <div class="summary-card">
          <div class="summary-num" :class="avgEconomic < 0 ? 'neg' : 'pos'">
            {{ avgEconomic > 0 ? '+' : '' }}{{ avgEconomic }}
          </div>
          <div class="summary-label">平均经济分</div>
        </div>
        <div class="summary-card">
          <div class="summary-num" :class="avgAuth >= 0 ? 'auth' : 'lib'">
            {{ avgAuth > 0 ? '+' : '' }}{{ avgAuth }}
          </div>
          <div class="summary-label">平均权威分</div>
        </div>
        <div class="summary-card">
          <div class="summary-num" :style="{ color: dominantColor }">
            {{ dominantQuadrantName }}
          </div>
          <div class="summary-label">最多象限</div>
        </div>
      </div>

      <!-- Charts -->
      <div class="charts-row">
        <div class="chart-card">
          <div class="chart-card-title">历史分布</div>
          <div ref="scatterRef" class="chart-area" aria-label="历史测试结果散点图"></div>
        </div>
        <div class="chart-card chart-card-sm">
          <div class="chart-card-title">象限分布</div>
          <div ref="pieRef" class="chart-area" aria-label="象限分布饼图"></div>
        </div>
      </div>

      <!-- History table -->
      <div class="table-card">
        <div class="table-card-title">历史记录</div>
        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>经济</th>
                <th>权威</th>
                <th>象限</th>
                <th>时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in sortedHistory" :key="item.timestamp">
                <td class="td-num">{{ sortedHistory.length - i }}</td>
                <td>
                  <span class="score-chip" :class="item.economicScore <= 0 ? 'chip-neg' : 'chip-pos'">
                    {{ item.economicScore > 0 ? '+' : '' }}{{ item.economicScore }}
                  </span>
                </td>
                <td>
                  <span class="score-chip" :class="item.authoritarianScore >= 0 ? 'chip-auth' : 'chip-lib'">
                    {{ item.authoritarianScore > 0 ? '+' : '' }}{{ item.authoritarianScore }}
                  </span>
                </td>
                <td>
                  <span class="q-chip" :style="{ color: getColor(item), background: getColor(item) + '15' }">
                    {{ getQName(item) }}
                  </span>
                </td>
                <td class="td-time">{{ formatTime(item.timestamp) }}</td>
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

const dominantQuadrantKey = computed(() => {
  const counts = {}
  history.value.forEach(h => {
    const k = getQuadrantKey(h.economicScore, h.authoritarianScore)
    counts[k] = (counts[k] || 0) + 1
  })
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0]
})
const dominantQuadrantName = computed(() => {
  return dominantQuadrantKey.value ? quadrants[dominantQuadrantKey.value].name : '—'
})
const dominantColor = computed(() => {
  return dominantQuadrantKey.value ? quadrants[dominantQuadrantKey.value].color : 'var(--text-3)'
})

function getQName(item) {
  return quadrants[getQuadrantKey(item.economicScore, item.authoritarianScore)].name
}
function getColor(item) {
  return quadrants[getQuadrantKey(item.economicScore, item.authoritarianScore)].color
}
function formatTime(ts) {
  return new Date(ts).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const scatterRef = ref(null)
const pieRef = ref(null)
let scatterChart = null
let pieChart = null
let ro = null

function renderCharts() {
  if (!history.value.length) return

  if (scatterRef.value) {
    if (!scatterChart) scatterChart = echarts.init(scatterRef.value)
    scatterChart.setOption({
      backgroundColor: '#ffffff',
      grid: { left: 52, right: 24, top: 20, bottom: 48 },
      xAxis: {
        type: 'value', min: -100, max: 100,
        axisLine: { lineStyle: { color: '#cbd5e1', width: 1.5 } },
        axisTick: { show: false }, splitLine: { show: false },
        axisLabel: { color: '#94a3b8', fontSize: 10,
          formatter: v => v === -100 ? '左' : v === 100 ? '右' : v === 0 ? '0' : '' },
      },
      yAxis: {
        type: 'value', min: -100, max: 100,
        axisLine: { lineStyle: { color: '#cbd5e1', width: 1.5 } },
        axisTick: { show: false }, splitLine: { show: false },
        axisLabel: { color: '#94a3b8', fontSize: 10,
          formatter: v => v === -100 ? '自由' : v === 100 ? '威权' : v === 0 ? '0' : '' },
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
          type: 'scatter', symbolSize: 10,
          data: history.value.map(h => ({
            value: [h.economicScore, h.authoritarianScore],
            itemStyle: { color: quadrants[getQuadrantKey(h.economicScore, h.authoritarianScore)].color, opacity: 0.8 },
          })),
        },
      ],
    })
  }

  if (pieRef.value) {
    if (!pieChart) pieChart = echarts.init(pieRef.value)
    const counts = {}
    history.value.forEach(h => {
      const k = getQuadrantKey(h.economicScore, h.authoritarianScore)
      counts[k] = (counts[k] || 0) + 1
    })
    pieChart.setOption({
      backgroundColor: '#ffffff',
      series: [{
        type: 'pie',
        radius: ['40%', '68%'],
        avoidLabelOverlap: true,
        itemStyle: { borderColor: '#fff', borderWidth: 3, borderRadius: 5 },
        label: { color: '#475569', fontSize: 11, fontWeight: 500 },
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
  ro = new ResizeObserver(() => { scatterChart?.resize(); pieChart?.resize() })
  if (scatterRef.value) ro.observe(scatterRef.value)
  if (pieRef.value) ro.observe(pieRef.value)
})

onUnmounted(() => {
  ro?.disconnect()
  scatterChart?.dispose()
  pieChart?.dispose()
})

watch(history, () => renderCharts(), { deep: true })
</script>

<style scoped>
.stats-view {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stats-header { padding: 8px 0; }

.stats-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -.01em;
  margin-bottom: 4px;
}

.stats-sub { font-size: 14px; color: var(--text-3); }

/* Empty state */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.empty-icon {
  width: 72px;
  height: 72px;
  background: var(--bg-subtle);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state p { font-size: 15px; color: var(--text-2); }

/* Summary grid */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.summary-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px 16px;
  box-shadow: var(--shadow-sm);
  text-align: center;
}

.summary-num {
  font-size: 26px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  margin-bottom: 4px;
  color: var(--text);
}

.summary-num.neg   { color: #dc2626; }
.summary-num.pos   { color: #1d4ed8; }
.summary-num.auth  { color: #7c3aed; }
.summary-num.lib   { color: #16a34a; }

.summary-label { font-size: 12px; color: var(--text-3); font-weight: 500; }

/* Charts */
.charts-row {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 12px;
}

.chart-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px;
  box-shadow: var(--shadow-sm);
}

.chart-card-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-2);
  margin-bottom: 12px;
}

.chart-area {
  width: 100%;
  height: 300px;
}

/* Table */
.table-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px;
  box-shadow: var(--shadow-sm);
}

.table-card-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-2);
  margin-bottom: 14px;
}

.table-scroll { overflow-x: auto; }

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th {
  padding: 8px 12px;
  text-align: left;
  color: var(--text-3);
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .05em;
  border-bottom: 1px solid var(--border);
}

td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--bg-subtle);
  vertical-align: middle;
}

tr:last-child td { border-bottom: none; }
tr:hover td { background: var(--bg-subtle); }

.td-num { color: var(--text-3); font-size: 12px; }
.td-time { color: var(--text-3); font-size: 12px; font-variant-numeric: tabular-nums; }

.score-chip {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  font-variant-numeric: tabular-nums;
}

.chip-neg  { background: #fee2e2; color: #dc2626; }
.chip-pos  { background: #dbeafe; color: #1d4ed8; }
.chip-auth { background: #ede9fe; color: #7c3aed; }
.chip-lib  { background: #dcfce7; color: #15803d; }

.q-chip {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
}

/* Shared btn for empty state */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: var(--radius-sm);
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: var(--transition);
}

.btn-primary { background: var(--primary); color: #fff; }
.btn-primary:hover { background: var(--primary-hover); transform: translateY(-1px); }

@media (max-width: 900px) {
  .summary-grid { grid-template-columns: repeat(2, 1fr); }
  .charts-row   { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .summary-grid { grid-template-columns: 1fr 1fr; }
  .chart-area { height: 240px; }
  .stats-title { font-size: 22px; }
}
</style>
