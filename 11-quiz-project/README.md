# 11

## Uncaught Error: Rendered fewer hooks than expected. This may be caused by an accidental early return statement.

- 예상보다 적은 훅이 렌더됐을 경우 발생하는 에러
- 훅 사용보다 앞서 return문이 작성될 경우 생김
- 훅은 무조건 상위 부분으로 다 올려야 함
- 반복문, 조건문 혹은 중첩된 함수 내에서 Hooks을 호출하면 안됨
- 만약 조건부로 effect를 실행하고 싶다면 조건문을 Hooks 내부에 넣어야

```jsx
import { useState, useCallback } from "react"

import Question from "./Question.jsx"
import Summary from "../summary/Summary.jsx"

import QUESTIONS from "../../questions.js"

import quizCompleteImg from "../../assets/quiz-complete.png"

export default function Quiz() {
  const [userAnswers, setUserAnswers] = useState([])

  const activeQuestionIndex = userAnswers.length

  const quizIsComplete = activeQuestionIndex >= QUESTIONS.length

  if (quizIsComplete) {
    return <Summary userAnswers={userAnswers} />
  }

  const handleSelectAnswer = useCallback(function handleSelectAnswer(selectedAnswer) {
    setUserAnswers((prevUserAnswers) => {
      return [...prevUserAnswers, selectedAnswer]
    })
  }, [])

  const handleSkipAnswer = useCallback(() => handleSelectAnswer(null), [handleSelectAnswer])

  return (
    <div id="quiz">
      {/* key 속성을 이용해서 새 질문으로 넘어갈 때마다 QuestionTimer 컴포넌트가 재생성되도록 설정하기 */}
      <Question key={activeQuestionIndex} index={activeQuestionIndex} onSelectAnswer={handleSelectAnswer} onSkipAnswer={handleSkipAnswer} />
    </div>
  )
}
```

### 해결된 코드

```jsx
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
```
