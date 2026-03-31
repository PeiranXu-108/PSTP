import { questions } from '../data/questions.js'

export function calculateScores(answers, selectedQuestionIds) {
  const pool = selectedQuestionIds?.length
    ? questions.filter(q => selectedQuestionIds.includes(q.id))
    : questions.filter(q => answers[q.id] !== undefined)

  const economicQuestions = pool.filter(q => q.dimension === 'economic')
  const authoritarianQuestions = pool.filter(q => q.dimension === 'authoritarian')

  const calcDimension = (dimQuestions) => {
    let rawScore = 0
    let maxPossible = 0

    for (const q of dimQuestions) {
      const userAnswer = answers[q.id]
      if (userAnswer !== undefined) {
        rawScore += q.weight * q.direction * userAnswer
        maxPossible += q.weight * 2
      }
    }

    if (maxPossible === 0) return 0
    return Math.round((rawScore / maxPossible) * 100)
  }

  return {
    economicScore: calcDimension(economicQuestions),
    authoritarianScore: calcDimension(authoritarianQuestions),
  }
}
