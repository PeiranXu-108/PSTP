<template>
  <div class="test-view">

    <!-- Progress header -->
    <div class="progress-card">
      <div class="progress-top">
        <div class="progress-info">
          <span class="progress-title">答题进度</span>
          <span class="progress-fraction">
            <strong>{{ answeredCount }}</strong> / {{ totalQuestions }} 题已完成
          </span>
        </div>
        <span class="progress-pct">{{ progressPercent }}%</span>
      </div>
      <div class="progress-track" role="progressbar" :aria-valuenow="progressPercent" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      </div>
      <div class="steps-row" aria-label="章节进度">
        <button
          v-for="page in totalPages"
          :key="page"
          class="step-dot"
          :class="{
            active: page === currentStep,
            done: isPageComplete(page) && page !== currentStep,
          }"
          :aria-label="`第 ${page} 页`"
          :aria-current="page === currentStep ? 'step' : undefined"
          @click="goToPage(page)"
        >
          <template v-if="isPageComplete(page) && page !== currentStep">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M2 5l2.5 2.5L8 3" stroke="#16a34a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </template>
          <template v-else>{{ page }}</template>
        </button>
      </div>
    </div>

    <!-- Page label -->
    <div class="page-label">
      第 {{ currentStep }} / {{ totalPages }} 页
    </div>

    <!-- Questions -->
    <transition name="slide" mode="out-in">
      <div class="questions-list" :key="currentStep">
        <QuestionCard
          v-for="q in currentQuestions"
          :key="q.id"
          :question="q"
          :model-value="answers[q.id]"
          @update:model-value="setAnswer(q.id, $event)"
        />
      </div>
    </transition>

    <!-- Navigation -->
    <div class="nav-bar">
      <button
        class="btn btn-ghost"
        :disabled="currentStep === 1"
        @click="prevPage"
        aria-label="上一页"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        上一页
      </button>

      <span class="nav-hint" v-if="!isCurrentPageComplete">
        请完成本页所有题目
      </span>

      <button
        v-if="currentStep < totalPages"
        class="btn btn-primary"
        :disabled="!isCurrentPageComplete"
        @click="nextPage"
        aria-label="下一页"
      >
        下一页
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>

      <button
        v-else
        class="btn btn-success"
        :disabled="!allAnswered"
        @click="submitTest"
        aria-label="提交并查看结果"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        提交并查看结果
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import QuestionCard from '../components/QuestionCard.vue'
import { questions, QUESTIONS_PER_PAGE } from '../data/questions.js'

const store = useStore()
const router = useRouter()

const idToQuestion = new Map(questions.map(q => [q.id, q]))

const selectedQuestions = computed(() =>
  store.state.selectedQuestionIds
    .map(id => idToQuestion.get(id))
    .filter(Boolean),
)

const totalQuestions = computed(() => selectedQuestions.value.length)
const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalQuestions.value / QUESTIONS_PER_PAGE)),
)

const currentStep = computed(() => store.state.currentStep)
const answers = computed(() => store.state.answers)
const answeredCount = computed(() => store.getters.answeredCount)
const progressPercent = computed(() => store.getters.progressPercent)

const currentQuestions = computed(() => {
  const start = (currentStep.value - 1) * QUESTIONS_PER_PAGE
  return selectedQuestions.value.slice(start, start + QUESTIONS_PER_PAGE)
})

const isCurrentPageComplete = computed(() =>
  currentQuestions.value.every(q => answers.value[q.id] !== undefined)
)

const allAnswered = computed(() => answeredCount.value === totalQuestions.value)

function isPageComplete(page) {
  const start = (page - 1) * QUESTIONS_PER_PAGE
  return selectedQuestions.value.slice(start, start + QUESTIONS_PER_PAGE)
    .every(q => answers.value[q.id] !== undefined)
}

onMounted(() => {
  if (!store.state.selectedQuestionIds?.length) {
    router.replace({ name: 'Home' })
  }
})

function setAnswer(questionId, value) {
  store.commit('SET_ANSWER', { questionId, value })
}

function goToPage(page) {
  store.commit('SET_STEP', page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function prevPage() {
  if (currentStep.value > 1) goToPage(currentStep.value - 1)
}

function nextPage() {
  const lastPage = totalPages.value
  if (currentStep.value < lastPage) goToPage(currentStep.value + 1)
}

async function submitTest() {
  try {
    await ElMessageBox.confirm(
      '确认提交你的所有回答？',
      '提交确认',
      { confirmButtonText: '确认提交', cancelButtonText: '再看看', type: 'info' }
    )
    await store.dispatch('submitTest')
    router.push('/result')
  } catch {
    // cancelled
  }
}

const encourageShown = { 50: false, 80: false }
watch(progressPercent, (val) => {
  if (val >= 50 && val < 55 && !encourageShown[50]) {
    encourageShown[50] = true
    ElMessage({ message: '已经过半了！你独特的思想画卷马上揭晓', type: 'success', duration: 3000 })
  }
  if (val >= 80 && val < 85 && !encourageShown[80]) {
    encourageShown[80] = true
    ElMessage({ message: '快完成了！坚持住', type: 'success', duration: 3000 })
  }
})

onBeforeRouteLeave(async (to) => {
  if (answeredCount.value > 0 && !store.state.result && to.name !== 'Result') {
    try {
      await ElMessageBox.confirm(
        '进度已自动保存，下次可继续。确认离开？',
        '离开确认',
        { confirmButtonText: '确认离开', cancelButtonText: '继续答题', type: 'warning' }
      )
      return true
    } catch {
      return false
    }
  }
})
</script>

<style scoped>
.test-view {
  max-width: 680px;
  margin: 0 auto;
}

/* Progress card */
.progress-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px 22px;
  margin-bottom: 20px;
  box-shadow: var(--shadow-sm);
}

.progress-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 10px;
}

.progress-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .05em;
  color: var(--text-3);
  display: block;
  margin-bottom: 2px;
}

.progress-fraction {
  font-size: 13px;
  color: var(--text-2);
}

.progress-fraction strong {
  font-size: 16px;
  font-weight: 700;
  color: var(--primary);
}

.progress-pct {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary);
  font-variant-numeric: tabular-nums;
}

.progress-track {
  height: 6px;
  background: var(--bg-subtle);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 14px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #3b82f6);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.steps-row {
  display: flex;
  gap: 6px;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.step-dot {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  border: 1.5px solid var(--border);
  background: var(--bg-card);
  color: var(--text-3);
  cursor: pointer;
  transition: var(--transition);
  font-family: inherit;
}

.step-dot:hover { border-color: var(--primary); color: var(--primary); }
.step-dot.active { background: var(--primary); border-color: var(--primary); color: #fff; }
.step-dot.done { border-color: #bbf7d0; background: #f0fdf4; }

/* Page label */
.page-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-3);
  text-transform: uppercase;
  letter-spacing: .05em;
  margin-bottom: 12px;
}

/* Questions */
.questions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Nav bar */
.nav-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 28px;
  padding-bottom: 40px;
}

.nav-hint {
  flex: 1;
  font-size: 12px;
  color: var(--text-3);
  text-align: center;
}

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
  white-space: nowrap;
}

.btn:disabled {
  opacity: .45;
  cursor: not-allowed;
  transform: none !important;
}

.btn-ghost {
  background: var(--bg-card);
  color: var(--text-2);
  border: 1px solid var(--border);
}

.btn-ghost:not(:disabled):hover {
  background: var(--bg-subtle);
  color: var(--text);
}

.btn-primary {
  background: var(--primary);
  color: #fff;
  box-shadow: 0 1px 3px rgba(37,99,235,.20);
  margin-left: auto;
}

.btn-primary:not(:disabled):hover {
  background: var(--primary-hover);
  box-shadow: 0 4px 12px rgba(37,99,235,.28);
  transform: translateY(-1px);
}

.btn-success {
  background: var(--success);
  color: #fff;
  box-shadow: 0 1px 3px rgba(22,163,74,.20);
  margin-left: auto;
}

.btn-success:not(:disabled):hover {
  background: #15803d;
  box-shadow: 0 4px 12px rgba(22,163,74,.28);
  transform: translateY(-1px);
}

/* Transition */
.slide-enter-active, .slide-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.slide-enter-from { opacity: 0; transform: translateX(12px); }
.slide-leave-to   { opacity: 0; transform: translateX(-12px); }

@media (max-width: 640px) {
  .nav-bar { flex-wrap: wrap; }
  .btn-primary, .btn-success { width: 100%; justify-content: center; }
  .btn-ghost { width: 100%; justify-content: center; }
}

@media (prefers-reduced-motion: reduce) {
  .slide-enter-active, .slide-leave-active { transition: none; }
  .progress-fill { transition: none; }
}
</style>
