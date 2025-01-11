import { useState, useCallback } from "react"

import Question from "./Question.jsx"
import Summary from "../summary/Summary.jsx"

import QUESTIONS from "../../questions.js"

import quizCompleteImg from "../../assets/quiz-complete.png"

export default function Quiz() {
  const [userAnswers, setUserAnswers] = useState([])

  const activeQuestionIndex = userAnswers.length

  const quizIsComplete = activeQuestionIndex >= QUESTIONS.length

  const handleSelectAnswer = useCallback(function handleSelectAnswer(selectedAnswer) {
    setUserAnswers((prevUserAnswers) => {
      return [...prevUserAnswers, selectedAnswer]
    })
  }, [])

  const handleSkipAnswer = useCallback(() => handleSelectAnswer(null), [handleSelectAnswer])

  console.log(quizIsComplete)
  console.log(userAnswers)

  if (quizIsComplete) {
    return <Summary userAnswers={userAnswers} />
  }

  return (
    <div id="quiz">
      {/* key 속성을 이용해서 새 질문으로 넘어갈 때마다 QuestionTimer 컴포넌트가 재생성되도록 설정하기 */}
      <Question key={activeQuestionIndex} index={activeQuestionIndex} onSelectAnswer={handleSelectAnswer} onSkipAnswer={handleSkipAnswer} />
    </div>
  )
}
