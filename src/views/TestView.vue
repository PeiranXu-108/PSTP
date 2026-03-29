<template>
  <div class="test-view">
    <div class="progress-section">
      <div class="progress-header">
        <span class="progress-label">答题进度</span>
        <span class="progress-count">{{ answeredCount }} / {{ totalQuestions }} 题</span>
      </div>
      <el-progress
        :percentage="progressPercent"
        :stroke-width="8"
        :show-text="false"
        color="#6366f1"
      />
      <div class="steps-row">
        <div
          v-for="page in totalPages"
          :key="page"
          class="step-dot"
          :class="{
            active: page === currentStep,
            done: page < currentStep || isPageComplete(page),
          }"
          @click="goToPage(page)"
        >
          {{ page }}
        </div>
      </div>
    </div>

    <transition name="fade" mode="out-in">
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

    <div class="nav-buttons">
      <el-button
        size="large"
        :disabled="currentStep === 1"
        @click="prevPage"
      >
        上一页
      </el-button>
      <el-button
        v-if="currentStep < totalPages"
        type="primary"
        size="large"
        :disabled="!isCurrentPageComplete"
        @click="nextPage"
      >
        下一页
      </el-button>
      <el-button
        v-else
        type="success"
        size="large"
        :disabled="!allAnswered"
        @click="submitTest"
      >
        提交并查看结果
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import QuestionCard from '../components/QuestionCard.vue'
import { questions, QUESTIONS_PER_PAGE, TOTAL_PAGES } from '../data/questions.js'

const store = useStore()
const router = useRouter()

const totalQuestions = questions.length
const totalPages = TOTAL_PAGES

const currentStep = computed(() => store.state.currentStep)
const answers = computed(() => store.state.answers)
const answeredCount = computed(() => store.getters.answeredCount)
const progressPercent = computed(() => store.getters.progressPercent)

const currentQuestions = computed(() => {
  const start = (currentStep.value - 1) * QUESTIONS_PER_PAGE
  return questions.slice(start, start + QUESTIONS_PER_PAGE)
})

const isCurrentPageComplete = computed(() => {
  return currentQuestions.value.every(q => answers.value[q.id] !== undefined)
})

const allAnswered = computed(() => answeredCount.value === totalQuestions)

function isPageComplete(page) {
  const start = (page - 1) * QUESTIONS_PER_PAGE
  const pageQuestions = questions.slice(start, start + QUESTIONS_PER_PAGE)
  return pageQuestions.every(q => answers.value[q.id] !== undefined)
}

function setAnswer(questionId, value) {
  store.commit('SET_ANSWER', { questionId, value })
}

function goToPage(page) {
  store.commit('SET_STEP', page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function prevPage() {
  if (currentStep.value > 1) {
    goToPage(currentStep.value - 1)
  }
}

function nextPage() {
  if (currentStep.value < totalPages) {
    goToPage(currentStep.value + 1)
  }
}

async function submitTest() {
  try {
    await ElMessageBox.confirm(
      '确认提交你的所有回答？提交后不可修改。',
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
    ElMessage({ message: '已经过半了！你独特的思想画卷马上就要揭晓', type: 'success', duration: 3000 })
  }
  if (val >= 80 && val < 85 && !encourageShown[80]) {
    encourageShown[80] = true
    ElMessage({ message: '马上就要完成了！坚持住', type: 'success', duration: 3000 })
  }
})

onBeforeRouteLeave(async (to) => {
  if (answeredCount.value > 0 && !store.state.result && to.name !== 'Result') {
    try {
      await ElMessageBox.confirm(
        '你的答题进度已自动保存，下次可继续。确认离开吗？',
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
  max-width: 720px;
  margin: 0 auto;
}

.progress-section {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 24px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
}

.progress-label {
  color: var(--color-text-secondary);
}

.progress-count {
  color: var(--color-primary);
  font-weight: 600;
}

.steps-row {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}

.step-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  border: 2px solid var(--color-border);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.step-dot:hover {
  border-color: var(--color-primary);
}

.step-dot.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.step-dot.done {
  border-color: #22c55e;
  color: #22c55e;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.nav-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
  padding-bottom: 40px;
}

.nav-buttons .el-button {
  min-width: 140px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .progress-section {
    padding: 16px;
  }
  .step-dot {
    width: 28px;
    height: 28px;
    font-size: 11px;
  }
  .nav-buttons .el-button {
    min-width: 110px;
  }
}
</style>
