<template>
  <div class="home">
    <section class="hero">
      <div class="quadrant-bg">
        <div class="q-block q-tl"></div>
        <div class="q-block q-tr"></div>
        <div class="q-block q-bl"></div>
        <div class="q-block q-br"></div>
      </div>
      <div class="hero-content">
        <h1 class="hero-title">探索你的政治光谱</h1>
        <p class="hero-subtitle">
          通过 40 道精心设计的题目，了解你在经济与社会权威两个维度上的政治倾向
        </p>
      </div>
    </section>

    <section class="info-cards">
      <div class="info-card">
        <div class="card-icon">⏱</div>
        <h3>5 - 8 分钟</h3>
        <p>40 道题目，每页 5 题，轻松完成</p>
      </div>
      <div class="info-card">
        <div class="card-icon">🔒</div>
        <h3>完全隐私</h3>
        <p>纯前端运行，数据仅存储在你的浏览器中</p>
      </div>
      <div class="info-card">
        <div class="card-icon">📊</div>
        <h3>二维模型</h3>
        <p>经济左右 × 权威自由，精确定位你的政治坐标</p>
      </div>
    </section>

    <section class="dimensions">
      <h2>两个核心维度</h2>
      <div class="dim-grid">
        <div class="dim-card">
          <h3>
            <span class="dim-dot" style="background: linear-gradient(135deg, var(--color-left-auth), var(--color-left-lib))"></span>
            经济维度
          </h3>
          <div class="dim-axis">
            <span class="axis-left">国家干预</span>
            <div class="axis-line"></div>
            <span class="axis-right">市场自由</span>
          </div>
          <p>涵盖税收、福利、产权、监管等核心经济议题</p>
        </div>
        <div class="dim-card">
          <h3>
            <span class="dim-dot" style="background: linear-gradient(135deg, var(--color-right-auth), var(--color-right-lib))"></span>
            权威维度
          </h3>
          <div class="dim-axis">
            <span class="axis-left">个人自由</span>
            <div class="axis-line"></div>
            <span class="axis-right">社会秩序</span>
          </div>
          <p>涵盖言论自由、国家安全、法律秩序、个人权利等社会议题</p>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <el-button
        v-if="hasUnfinished"
        type="warning"
        size="large"
        round
        class="cta-btn cta-resume"
        @click="resumeTest"
      >
        继续上次测试（已完成 {{ answeredCount }}/40 题）
      </el-button>
      <el-button
        type="primary"
        size="large"
        round
        class="cta-btn"
        @click="startTest"
      >
        {{ hasUnfinished ? '重新开始' : '开始测试' }}
      </el-button>
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
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.hero {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  padding: 80px 40px;
  text-align: center;
}

.quadrant-bg {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  opacity: 0.4;
}

.q-block { transition: opacity 0.3s; }
.q-tl { background: var(--color-left-auth-bg); }
.q-tr { background: var(--color-right-auth-bg); }
.q-bl { background: var(--color-left-lib-bg); }
.q-br { background: var(--color-right-lib-bg); }

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #6366f1, #a78bfa, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 18px;
  color: var(--color-text-secondary);
  max-width: 520px;
  margin: 0 auto;
  line-height: 1.6;
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.info-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 28px 24px;
  text-align: center;
  transition: transform 0.2s, border-color 0.2s;
}

.info-card:hover {
  transform: translateY(-2px);
  border-color: var(--color-primary);
}

.card-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.info-card h3 {
  font-size: 18px;
  margin-bottom: 8px;
}

.info-card p {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.dimensions {
  text-align: center;
}

.dimensions h2 {
  font-size: 24px;
  margin-bottom: 24px;
}

.dim-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.dim-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 28px 24px;
  text-align: left;
}

.dim-card h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  margin-bottom: 16px;
}

.dim-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dim-axis {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.axis-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-text-secondary));
  border-radius: 1px;
}

.dim-card p {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.cta-section {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px 0 40px;
}

.cta-btn {
  min-width: 240px;
  height: 48px !important;
  font-size: 16px !important;
  font-weight: 600;
}

@media (max-width: 768px) {
  .hero {
    padding: 48px 20px;
  }
  .hero-title {
    font-size: 28px;
  }
  .hero-subtitle {
    font-size: 15px;
  }
  .info-cards {
    grid-template-columns: 1fr;
  }
  .dim-grid {
    grid-template-columns: 1fr;
  }
}
</style>
