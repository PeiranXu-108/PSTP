<template>
  <div class="explain-wrap">

    <!-- Score pills row -->
    <div class="score-row">
      <div class="score-pill">
        <span class="score-pill-label">经济</span>
        <span class="score-pill-val" :class="economicScore < 0 ? 'neg' : 'pos'">
          {{ economicScore > 0 ? '+' : '' }}{{ economicScore }}
        </span>
        <span class="score-pill-hint">{{ economicScore <= 0 ? '国家干预' : '市场自由' }}</span>
      </div>
      <div class="score-divider"></div>
      <div class="score-pill">
        <span class="score-pill-label">权威</span>
        <span class="score-pill-val" :class="authoritarianScore >= 0 ? 'auth' : 'lib'">
          {{ authoritarianScore > 0 ? '+' : '' }}{{ authoritarianScore }}
        </span>
        <span class="score-pill-hint">{{ authoritarianScore >= 0 ? '社会秩序' : '个人自由' }}</span>
      </div>
    </div>

    <!-- Quadrant header -->
    <div class="q-header" :style="{ '--qc': quadrant.color, '--qbg': quadrant.bgColor }">
      <div class="q-title-block">
        <h2 class="q-name">{{ quadrant.name }}</h2>
        <span class="q-en">{{ quadrant.nameEn }}</span>
      </div>
      <span class="intensity-tag" :style="{ background: quadrant.color + '18', color: quadrant.color }">
        {{ intensityLabel }}
      </span>
    </div>

    <p class="q-desc">{{ quadrant.description }}</p>

    <!-- Ideologies -->
    <div class="section">
      <h3 class="section-title">相近意识形态</h3>
      <div class="tag-list">
        <span v-for="ideo in quadrant.ideologies" :key="ideo" class="tag">{{ ideo }}</span>
      </div>
    </div>

    <!-- Parties -->
    <div class="section">
      <h3 class="section-title">意识形态相近的主流政党</h3>
      <div class="party-list">
        <a
          v-for="party in quadrant.parties"
          :key="party.name"
          :href="party.wiki"
          target="_blank"
          rel="noopener noreferrer"
          class="party-card"
          :aria-label="`${party.country} - ${party.name}（维基百科）`"
        >
          <span class="party-flag" aria-hidden="true">{{ party.flag }}</span>
          <div class="party-info">
            <span class="party-name">{{ party.name }}</span>
            <span class="party-country">{{ party.country }}</span>
          </div>
          <svg class="ext-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6m0 0v6m0-6L10 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>
    </div>

    <!-- Intensity description -->
    <div class="intensity-box" :style="{ borderLeftColor: quadrant.color }">
      <span class="intensity-box-label">{{ intensityLabel }}倾向</span>
      <p>{{ currentRange.description }}</p>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { quadrants, getQuadrantKey, getIntensityLevel } from '../data/ideologies.js'

const props = defineProps({
  economicScore:     { type: Number, required: true },
  authoritarianScore: { type: Number, required: true },
})

const quadrantKey   = computed(() => getQuadrantKey(props.economicScore, props.authoritarianScore))
const quadrant      = computed(() => quadrants[quadrantKey.value])
const intensity     = computed(() => getIntensityLevel(props.economicScore, props.authoritarianScore))
const currentRange  = computed(() => quadrant.value.scoreRanges[intensity.value])
const intensityLabel = computed(() => currentRange.value.label)
</script>

<style scoped>
.explain-wrap {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Score row */
.score-row {
  display: flex;
  align-items: stretch;
  gap: 0;
  background: var(--bg-subtle);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.score-pill {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 12px;
  gap: 3px;
}

.score-divider {
  width: 1px;
  background: var(--border);
}

.score-pill-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .05em;
  color: var(--text-3);
}

.score-pill-val {
  font-size: 28px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.score-pill-val.neg   { color: #dc2626; }
.score-pill-val.pos   { color: #1d4ed8; }
.score-pill-val.auth  { color: #7c3aed; }
.score-pill-val.lib   { color: #16a34a; }

.score-pill-hint {
  font-size: 11px;
  color: var(--text-3);
}

/* Quadrant header */
.q-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.q-name {
  font-size: 22px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 3px;
}

.q-en {
  font-size: 12px;
  color: var(--text-3);
}

.intensity-tag {
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: 4px;
}

.q-desc {
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-2);
}

/* Section */
.section { display: flex; flex-direction: column; gap: 10px; }

.section-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .05em;
  color: var(--text-3);
}

.tag-list { display: flex; flex-wrap: wrap; gap: 6px; }

.tag {
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 6px;
  background: var(--bg-subtle);
  color: var(--text-2);
  border: 1px solid var(--border);
}

.party-list { display: flex; flex-direction: column; gap: 6px; }

.party-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--bg-card);
  text-decoration: none;
  color: var(--text);
  transition: var(--transition);
  cursor: pointer;
}

.party-card:hover {
  border-color: var(--primary);
  background: var(--primary-light);
}

.party-flag { font-size: 22px; line-height: 1; }

.party-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.party-name   { font-size: 13px; font-weight: 500; color: var(--text); }
.party-country { font-size: 11px; color: var(--text-3); }

.ext-icon { color: var(--text-3); flex-shrink: 0; }
.party-card:hover .ext-icon { color: var(--primary); }

/* Intensity box */
.intensity-box {
  border-left: 3px solid;
  padding: 12px 16px;
  background: var(--bg-subtle);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.intensity-box-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .05em;
  color: var(--text-3);
  margin-bottom: 4px;
}

.intensity-box p {
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-2);
}
</style>
