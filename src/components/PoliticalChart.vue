<template>
  <div ref="chartRef" class="political-chart" aria-label="政治光谱二维坐标图"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  economicScore:     { type: Number, required: true },
  authoritarianScore: { type: Number, required: true },
})

const chartRef = ref(null)
let chart = null

function buildOption() {
  return {
    backgroundColor: '#ffffff',
    grid: { left: 68, right: 48, top: 44, bottom: 64 },
    xAxis: {
      type: 'value',
      min: -100, max: 100,
      name: '经济维度',
      nameLocation: 'middle',
      nameGap: 44,
      nameTextStyle: { color: '#64748b', fontSize: 12, fontWeight: 500 },
      axisLine: { lineStyle: { color: '#cbd5e1', width: 1.5 } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: {
        color: '#94a3b8',
        fontSize: 11,
        formatter(val) {
          if (val === -100) return '国家干预'
          if (val ===  100) return '市场自由'
          return val === 0 ? '0' : ''
        },
      },
    },
    yAxis: {
      type: 'value',
      min: -100, max: 100,
      name: '权威维度',
      nameLocation: 'middle',
      nameGap: 50,
      nameTextStyle: { color: '#64748b', fontSize: 12, fontWeight: 500 },
      axisLine: { lineStyle: { color: '#cbd5e1', width: 1.5 } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: {
        color: '#94a3b8',
        fontSize: 11,
        formatter(val) {
          if (val === -100) return '个人自由'
          if (val ===  100) return '社会秩序'
          return val === 0 ? '0' : ''
        },
      },
    },
    series: [
      {
        type: 'scatter',
        symbolSize: 0,
        data: [],
        markArea: {
          silent: true,
          data: [
            [{ xAxis: -100, yAxis:    0, itemStyle: { color: '#fef2f2' } }, { xAxis: 0, yAxis: 100 }],
            [{ xAxis:    0, yAxis:    0, itemStyle: { color: '#eff6ff' } }, { xAxis: 100, yAxis: 100 }],
            [{ xAxis: -100, yAxis: -100, itemStyle: { color: '#f0fdf4' } }, { xAxis: 0, yAxis: 0 }],
            [{ xAxis:    0, yAxis: -100, itemStyle: { color: '#fffbeb' } }, { xAxis: 100, yAxis: 0 }],
          ],
        },
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: { color: '#cbd5e1', type: 'solid', width: 1.5 },
          data: [{ xAxis: 0 }, { yAxis: 0 }],
          label: { show: false },
        },
      },
      {
        type: 'scatter',
        symbolSize: 0,
        data: [],
        markPoint: {
          symbol: 'rect',
          symbolSize: 0,
          label: { show: true, fontSize: 10, fontWeight: 600 },
          data: [
            { coord: [-58, 62],  value: '左翼威权', label: { color: '#dc2626' } },
            { coord: [ 58, 62],  value: '右翼威权', label: { color: '#1d4ed8' } },
            { coord: [-58, -62], value: '左翼自由', label: { color: '#16a34a' } },
            { coord: [ 58, -62], value: '右翼自由', label: { color: '#b45309' } },
          ],
        },
      },
      {
        type: 'effectScatter',
        symbolSize: 16,
        rippleEffect: { brushType: 'stroke', scale: 3, period: 2.5 },
        itemStyle: {
          color: '#dc2626',
          borderColor: '#fff',
          borderWidth: 2,
          shadowBlur: 8,
          shadowColor: 'rgba(220,38,38,.35)',
        },
        data: [[props.economicScore, props.authoritarianScore]],
        z: 10,
      },
    ],
  }
}

let ro = null

onMounted(() => {
  chart = echarts.init(chartRef.value, null, { renderer: 'canvas' })
  chart.setOption(buildOption())
  ro = new ResizeObserver(() => chart?.resize())
  ro.observe(chartRef.value)
})

onUnmounted(() => {
  ro?.disconnect()
  chart?.dispose()
})

watch(() => [props.economicScore, props.authoritarianScore], () => {
  chart?.setOption(buildOption())
})
</script>

<style scoped>
.political-chart {
  width: 100%;
  height: 460px;
  border-radius: var(--radius-sm);
}

@media (max-width: 640px) {
  .political-chart { height: 340px; }
}
</style>
