<template>
  <div ref="chartRef" class="political-chart"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  economicScore: { type: Number, required: true },
  authoritarianScore: { type: Number, required: true },
})

const chartRef = ref(null)
let chart = null

function buildOption() {
  return {
    backgroundColor: 'transparent',
    grid: {
      left: 60,
      right: 40,
      top: 40,
      bottom: 60,
    },
    xAxis: {
      type: 'value',
      min: -100,
      max: 100,
      name: '经济维度',
      nameLocation: 'middle',
      nameGap: 40,
      nameTextStyle: { color: '#94a3b8', fontSize: 13 },
      axisLine: { lineStyle: { color: '#334155' } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: {
        color: '#64748b',
        formatter: (val) => {
          if (val === -100) return '国家干预'
          if (val === 100) return '市场自由'
          return val
        },
      },
    },
    yAxis: {
      type: 'value',
      min: -100,
      max: 100,
      name: '权威维度',
      nameLocation: 'middle',
      nameGap: 45,
      nameTextStyle: { color: '#94a3b8', fontSize: 13 },
      axisLine: { lineStyle: { color: '#334155' } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: {
        color: '#64748b',
        formatter: (val) => {
          if (val === -100) return '个人自由'
          if (val === 100) return '社会秩序'
          return val
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
            [
              { xAxis: -100, yAxis: 0, itemStyle: { color: '#ef444420' } },
              { xAxis: 0, yAxis: 100 },
            ],
            [
              { xAxis: 0, yAxis: 0, itemStyle: { color: '#3b82f620' } },
              { xAxis: 100, yAxis: 100 },
            ],
            [
              { xAxis: -100, yAxis: -100, itemStyle: { color: '#22c55e20' } },
              { xAxis: 0, yAxis: 0 },
            ],
            [
              { xAxis: 0, yAxis: -100, itemStyle: { color: '#eab30820' } },
              { xAxis: 100, yAxis: 0 },
            ],
          ],
        },
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: { color: '#475569', type: 'solid', width: 1 },
          data: [
            { xAxis: 0 },
            { yAxis: 0 },
          ],
          label: { show: false },
        },
      },
      {
        type: 'effectScatter',
        symbolSize: 16,
        rippleEffect: { brushType: 'stroke', scale: 3, period: 3 },
        itemStyle: { color: '#f43f5e', shadowBlur: 10, shadowColor: '#f43f5e66' },
        data: [[props.economicScore, props.authoritarianScore]],
        z: 10,
      },
      {
        type: 'scatter',
        symbolSize: 0,
        data: [],
        markPoint: {
          symbol: 'rect',
          symbolSize: 0,
          label: {
            show: true,
            fontSize: 11,
            color: '#64748b',
          },
          data: [
            { coord: [-55, 60],  value: '左翼威权', label: { color: '#ef4444' } },
            { coord: [55, 60],   value: '右翼威权', label: { color: '#3b82f6' } },
            { coord: [-55, -60], value: '左翼自由', label: { color: '#22c55e' } },
            { coord: [55, -60],  value: '右翼自由', label: { color: '#eab308' } },
          ],
        },
      },
    ],
  }
}

let resizeObserver = null

onMounted(() => {
  chart = echarts.init(chartRef.value)
  chart.setOption(buildOption())
  resizeObserver = new ResizeObserver(() => chart?.resize())
  resizeObserver.observe(chartRef.value)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  chart?.dispose()
})

watch(() => [props.economicScore, props.authoritarianScore], () => {
  chart?.setOption(buildOption())
})
</script>

<style scoped>
.political-chart {
  width: 100%;
  height: 480px;
  min-height: 360px;
}

@media (max-width: 640px) {
  .political-chart {
    height: 360px;
  }
}
</style>
