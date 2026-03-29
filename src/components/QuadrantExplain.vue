<template>
  <div class="quadrant-explain" :style="{ borderLeftColor: quadrant.color }">
    <div class="explain-header">
      <h2 class="quadrant-name">{{ quadrant.name }}</h2>
      <span class="quadrant-en">{{ quadrant.nameEn }}</span>
      <span class="intensity-badge" :style="{ background: quadrant.color + '22', color: quadrant.color }">
        {{ intensityLabel }}
      </span>
    </div>

    <div class="score-bars">
      <div class="score-item">
        <span class="score-label">经济维度</span>
        <div class="score-bar-track">
          <div
            class="score-bar-fill"
            :style="{ width: Math.abs(economicScore) + '%', background: economicScore < 0 ? '#ef4444' : '#3b82f6' }"
          ></div>
        </div>
        <span class="score-value">{{ economicScore > 0 ? '+' : '' }}{{ economicScore }}</span>
      </div>
      <div class="score-desc">{{ economicScore <= 0 ? '偏向国家干预 / 左翼' : '偏向市场自由 / 右翼' }}</div>

      <div class="score-item">
        <span class="score-label">权威维度</span>
        <div class="score-bar-track">
          <div
            class="score-bar-fill"
            :style="{ width: Math.abs(authoritarianScore) + '%', background: authoritarianScore >= 0 ? '#8b5cf6' : '#22c55e' }"
          ></div>
        </div>
        <span class="score-value">{{ authoritarianScore > 0 ? '+' : '' }}{{ authoritarianScore }}</span>
      </div>
      <div class="score-desc">{{ authoritarianScore >= 0 ? '偏向社会秩序 / 威权' : '偏向个人自由 / 自由意志' }}</div>
    </div>

    <p class="description">{{ quadrant.description }}</p>

    <div class="section">
      <h3>匹配意识形态</h3>
      <div class="tags">
        <span v-for="ideo in quadrant.ideologies" :key="ideo" class="tag">{{ ideo }}</span>
      </div>
    </div>

    <div class="section">
      <h3>意识形态相似的主流政党</h3>
      <div class="parties-list">
        <a
          v-for="party in quadrant.parties"
          :key="party.name"
          :href="party.wiki"
          target="_blank"
          rel="noopener"
          class="party-item"
        >
          <span class="party-flag">{{ party.flag }}</span>
          <div class="party-info">
            <span class="party-name">{{ party.name }}</span>
            <span class="party-country">{{ party.country }}</span>
          </div>
          <span class="wiki-icon">↗</span>
        </a>
      </div>
    </div>

    <div class="section">
      <h3>强度解读</h3>
      <p class="intensity-desc">{{ currentRange.description }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { quadrants, getQuadrantKey, getIntensityLevel } from '../data/ideologies.js'

const props = defineProps({
  economicScore: { type: Number, required: true },
  authoritarianScore: { type: Number, required: true },
})

const quadrantKey = computed(() => getQuadrantKey(props.economicScore, props.authoritarianScore))
const quadrant = computed(() => quadrants[quadrantKey.value])
const intensity = computed(() => getIntensityLevel(props.economicScore, props.authoritarianScore))
const currentRange = computed(() => quadrant.value.scoreRanges[intensity.value])
const intensityLabel = computed(() => currentRange.value.label)
</script>

<style scoped>
.quadrant-explain {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-left-width: 4px;
  border-radius: 12px;
  padding: 28px;
}

.explain-header {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.quadrant-name {
  font-size: 24px;
  font-weight: 700;
}

.quadrant-en {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.intensity-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 12px;
}

.score-bars {
  margin-bottom: 20px;
}

.score-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.score-label {
  font-size: 13px;
  color: var(--color-text-secondary);
  width: 70px;
  flex-shrink: 0;
}

.score-bar-track {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 3px;
  overflow: hidden;
}

.score-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s ease;
}

.score-value {
  font-size: 14px;
  font-weight: 700;
  width: 45px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.score-desc {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-left: 82px;
  margin-bottom: 12px;
}

.description {
  font-size: 15px;
  line-height: 1.7;
  color: var(--color-text-secondary);
  margin-bottom: 24px;
}

.section {
  margin-bottom: 20px;
}

.section h3 {
  font-size: 15px;
  margin-bottom: 12px;
  color: var(--color-text);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  font-size: 13px;
  padding: 4px 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.parties-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.party-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-border);
  text-decoration: none;
  color: var(--color-text);
  transition: border-color 0.2s;
}

.party-item:hover {
  border-color: var(--color-primary);
}

.party-flag {
  font-size: 24px;
}

.party-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.party-name {
  font-size: 14px;
  font-weight: 500;
}

.party-country {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.wiki-icon {
  font-size: 14px;
  color: var(--color-primary);
}

.intensity-desc {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

@media (max-width: 640px) {
  .quadrant-explain {
    padding: 20px;
  }
  .quadrant-name {
    font-size: 20px;
  }
}
</style>
