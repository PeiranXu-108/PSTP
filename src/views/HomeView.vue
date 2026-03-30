<template>
  <div class="home">

    <!-- Hero -->
    <section class="hero">
      <div class="hero-badge">政治学研究工具</div>
      <h1 class="hero-title">探索你的<br>政治光谱坐标</h1>
      <p class="hero-desc">
        40 道精心设计的题目，沿经济与权威两个维度衡量你的政治倾向，
        并在国际通用坐标图上标出你的位置。
      </p>

      <div class="cta-group">
        <button class="btn btn-primary" @click="startTest" aria-label="开始新测试">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 3l14 9-14 9V3z" fill="currentColor"/>
          </svg>
          开始测试
        </button>
        <button
          v-if="hasUnfinished"
          class="btn btn-secondary"
          @click="resumeTest"
          aria-label="继续上次测试"
        >
          继续上次（{{ answeredCount }}/40 题）
        </button>
      </div>

      <div class="hero-meta">
        <span class="meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
            <path d="M12 7v5l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          约 5–8 分钟
        </span>
        <span class="meta-sep">·</span>
        <span class="meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          数据不离开设备
        </span>
        <span class="meta-sep">·</span>
        <span class="meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
            <path d="M12 8v4l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          40 道题
        </span>
      </div>
    </section>

    <!-- Quadrant overview -->
    <section class="quadrant-section">
      <h2 class="section-title">四象限模型</h2>
      <div class="quadrant-grid">
        <div
          v-for="q in quadrantOverview"
          :key="q.key"
          class="q-card"
          :style="{ '--qc': q.color, '--qbg': q.bg }"
        >
          <div class="q-dot"></div>
          <div class="q-body">
            <div class="q-name">{{ q.name }}</div>
            <div class="q-en">{{ q.en }}</div>
            <p class="q-desc">{{ q.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Dimensions -->
    <section class="dim-section">
      <div class="dim-card">
        <div class="dim-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 12h18M3 6h18M3 18h18" stroke="#2563eb" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="dim-body">
          <h3>经济维度 (X 轴)</h3>
          <p>涵盖税收政策、市场监管、公有制与私有化、社会福利、贫富分配等核心议题。</p>
          <div class="dim-axis">
            <span class="axis-tag axis-l">国家干预</span>
            <div class="axis-track">
              <div class="axis-arrow"></div>
            </div>
            <span class="axis-tag axis-r">市场自由</span>
          </div>
        </div>
      </div>

      <div class="dim-card">
        <div class="dim-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="8" r="3" stroke="#2563eb" stroke-width="2"/>
            <path d="M6 20v-1a6 6 0 0 1 12 0v1" stroke="#2563eb" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="dim-body">
          <h3>权威维度 (Y 轴)</h3>
          <p>涵盖言论自由、国家安全、媒体管制、法律秩序、个人权利与政府权力边界。</p>
          <div class="dim-axis">
            <span class="axis-tag axis-l">个人自由</span>
            <div class="axis-track">
              <div class="axis-arrow"></div>
            </div>
            <span class="axis-tag axis-r">社会秩序</span>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const hasUnfinished = computed(() => store.getters.hasUnfinished)
const answeredCount = computed(() => store.getters.answeredCount)

function startTest() {
  store.dispatch('startNewTest')
  router.push('/test')
}

function resumeTest() {
  router.push('/test')
}

const quadrantOverview = [
  { key: 'la', name: '左翼威权主义', en: 'State Socialism', color: '#dc2626', bg: '#fef2f2',
    desc: '国家主导经济，集体利益优先，强力政府实现分配平等。' },
  { key: 'ra', name: '右翼威权主义', en: 'Conservatism', color: '#2563eb', bg: '#eff6ff',
    desc: '自由市场与国家权威并重，强调秩序、传统与民族利益。' },
  { key: 'll', name: '左翼自由意志主义', en: 'Libertarian Socialism', color: '#16a34a', bg: '#f0fdf4',
    desc: '追求经济平等与个人自由并举，反对国家与资本的双重垄断。' },
  { key: 'rl', name: '右翼自由意志主义', en: 'Libertarianism', color: '#d97706', bg: '#fffbeb',
    desc: '最小化政府干预，绝对市场自由与个人自治，反对一切国家管控。' },
]
</script>

<style scoped>
.home {
  max-width: 880px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

/* Hero */
.hero {
  text-align: center;
  padding: 56px 0 8px;
}

.hero-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: .05em;
  text-transform: uppercase;
  color: var(--primary);
  background: var(--primary-light);
  border: 1px solid #bfdbfe;
  border-radius: 20px;
  padding: 4px 14px;
  margin-bottom: 20px;
}

.hero-title {
  font-size: 46px;
  font-weight: 700;
  line-height: 1.18;
  letter-spacing: -.02em;
  color: var(--text);
  margin-bottom: 18px;
}

.hero-desc {
  font-size: 17px;
  line-height: 1.7;
  color: var(--text-2);
  max-width: 520px;
  margin: 0 auto 28px;
}

.cta-group {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 15px;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: var(--transition);
  font-family: inherit;
  line-height: 1;
}

.btn-primary {
  background: var(--primary);
  color: #fff;
  box-shadow: 0 1px 3px rgba(37,99,235,.25);
}

.btn-primary:hover {
  background: var(--primary-hover);
  box-shadow: 0 4px 12px rgba(37,99,235,.30);
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--bg-card);
  color: var(--text);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}

.btn-secondary:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-light);
}

.hero-meta {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--text-3);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.meta-sep { color: var(--border); }

/* Quadrant grid */
.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--text);
}

.quadrant-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.q-card {
  display: flex;
  gap: 14px;
  padding: 20px;
  border-radius: var(--radius);
  background: var(--bg-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  cursor: default;
}

.q-card:hover {
  box-shadow: var(--shadow);
  border-color: var(--qc);
  transform: translateY(-1px);
}

.q-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--qc);
  flex-shrink: 0;
  margin-top: 5px;
}

.q-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--qc);
  margin-bottom: 2px;
}

.q-en {
  font-size: 11px;
  color: var(--text-3);
  margin-bottom: 8px;
}

.q-desc {
  font-size: 13px;
  color: var(--text-2);
  line-height: 1.55;
}

/* Dimensions */
.dim-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.dim-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow-sm);
  display: flex;
  gap: 14px;
}

.dim-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: var(--primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dim-body h3 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
}

.dim-body p {
  font-size: 13px;
  color: var(--text-2);
  line-height: 1.55;
  margin-bottom: 12px;
}

.dim-axis {
  display: flex;
  align-items: center;
  gap: 8px;
}

.axis-tag {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
}

.axis-l { background: #fee2e2; color: #dc2626; }
.axis-r { background: #dbeafe; color: #1d4ed8; }

.axis-track {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, #dc2626, #1d4ed8);
  border-radius: 1px;
  position: relative;
}

.axis-arrow {
  position: absolute;
  right: -4px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  border-left: 6px solid #1d4ed8;
}

@media (max-width: 768px) {
  .hero-title { font-size: 32px; }
  .hero-desc { font-size: 15px; }
  .quadrant-grid { grid-template-columns: 1fr; }
  .dim-section { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .hero-title { font-size: 26px; }
}
</style>
