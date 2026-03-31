import { createStore } from 'vuex'
import { questions } from '../data/questions.js'
import { calculateScores } from '../utils/scoring.js'

const STORAGE_KEY = 'pstp_state'
const HISTORY_KEY = 'pstp_history'

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

function loadHistory() {
  try {
    const saved = localStorage.getItem(HISTORY_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const QUESTION_ORDER = new Map(questions.map((q, i) => [q.id, i]))

function deriveSelectedIdsFromAnswers(saved) {
  if (!saved?.answers || !Object.keys(saved.answers).length) return []
  return Object.keys(saved.answers).sort(
    (a, b) => (QUESTION_ORDER.get(a) ?? 0) - (QUESTION_ORDER.get(b) ?? 0),
  )
}

function buildInitialSelectedIds(saved) {
  if (saved?.selectedQuestionIds?.length) return saved.selectedQuestionIds
  return deriveSelectedIdsFromAnswers(saved)
}

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickRandomQuestionIds() {
  const econ = questions.filter(q => q.dimension === 'economic')
  const auth = questions.filter(q => q.dimension === 'authoritarian')
  const econIds = shuffleArray(econ).slice(0, 20).map(q => q.id)
  const authIds = shuffleArray(auth).slice(0, 20).map(q => q.id)
  return shuffleArray([...econIds, ...authIds])
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    answers: state.answers,
    currentStep: state.currentStep,
    selectedQuestionIds: state.selectedQuestionIds,
  }))
}

const saved = loadState()

export default createStore({
  state() {
    return {
      answers: saved?.answers || {},
      currentStep: saved?.currentStep || 1,
      selectedQuestionIds: buildInitialSelectedIds(saved),
      result: null,
      history: loadHistory(),
    }
  },

  getters: {
    answeredCount(state) {
      return Object.keys(state.answers).length
    },
    testQuestionCount(state) {
      return state.selectedQuestionIds.length
    },
    hasUnfinished(state) {
      const total = state.selectedQuestionIds.length
      if (total === 0) return false
      const count = Object.keys(state.answers).length
      return count > 0 && count < total
    },
    progressPercent(state) {
      const total = state.selectedQuestionIds.length
      if (total === 0) return 0
      return Math.round((Object.keys(state.answers).length / total) * 100)
    },
  },

  mutations: {
    SET_ANSWER(state, { questionId, value }) {
      state.answers[questionId] = value
      saveState(state)
    },

    SET_STEP(state, step) {
      state.currentStep = step
      saveState(state)
    },

    SET_SELECTED_QUESTION_IDS(state, ids) {
      state.selectedQuestionIds = ids
      saveState(state)
    },

    SET_RESULT(state, result) {
      state.result = result
    },

    ADD_HISTORY(state, record) {
      state.history.push(record)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(state.history))
    },

    RESET_TEST(state) {
      state.answers = {}
      state.currentStep = 1
      state.result = null
      state.selectedQuestionIds = []
      localStorage.removeItem(STORAGE_KEY)
    },
  },

  actions: {
    submitTest({ commit, state }) {
      const result = calculateScores(state.answers, state.selectedQuestionIds)
      commit('SET_RESULT', result)
      commit('ADD_HISTORY', {
        ...result,
        timestamp: Date.now(),
      })
      localStorage.removeItem(STORAGE_KEY)
      return result
    },

    startNewTest({ commit }) {
      commit('RESET_TEST')
      commit('SET_SELECTED_QUESTION_IDS', pickRandomQuestionIds())
    },
  },
})
