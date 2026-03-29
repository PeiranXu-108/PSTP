import { createStore } from 'vuex'
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

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    answers: state.answers,
    currentStep: state.currentStep,
  }))
}

const saved = loadState()

export default createStore({
  state() {
    return {
      answers: saved?.answers || {},
      currentStep: saved?.currentStep || 1,
      result: null,
      history: loadHistory(),
    }
  },

  getters: {
    answeredCount(state) {
      return Object.keys(state.answers).length
    },
    hasUnfinished(state) {
      const count = Object.keys(state.answers).length
      return count > 0 && count < 40
    },
    progressPercent(state) {
      return Math.round((Object.keys(state.answers).length / 40) * 100)
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
      localStorage.removeItem(STORAGE_KEY)
    },
  },

  actions: {
    submitTest({ commit, state }) {
      const result = calculateScores(state.answers)
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
    },
  },
})
