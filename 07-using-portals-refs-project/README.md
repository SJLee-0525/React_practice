# 8

## Refs

### useState 사용

```jsx
import { useState } from "react"

export default function Player() {
  const [enteredPlayerName, setEnteredPlayerName] = useState("")
  const [submitted, setSubmitted] = useState(false)

  function handleChange(event) {
    setSubmitted(false)
    setEnteredPlayerName(event.target.value)
  }

  function handleClick() {
    console.log(enteredPlayerName)
    setSubmitted(true)
  }

  return (
    <section id="player">
      <h2>Welcome {submitted ? enteredPlayerName : "unknown entity"}</h2>
      <p>
        <input type="text" onChange={handleChange} value={enteredPlayerName} />
        <button onClick={handleClick}>Set Name</button>
      </p>
    </section>
  )
}
```

### useRef 사용용

```jsx
import { useState, useRef } from "react"

export default function Player() {
  const playerName = useRef("")

  const [enteredPlayerName, setEnteredPlayerName] = useState(null)

  function handleClick() {
    setEnteredPlayerName(playerName.current.value)
    playerName.current.value = ""
  }

  return (
    <section id="player">
      {/* ?? 단축 삼항 연산자 */}
      <h2>Welcome {enteredPlayerName ?? "unknown entity"}</h2>
      <p>
        <input ref={playerName} type="text" />
        <button onClick={handleClick}>Set Name</button>
      </p>
    </section>
  )
}
```

- useRef로부터 받는 참조 값들은 항상 자바 스크립트 객체
- 항상 current 속성을 가지고 있음
- current 속성은 실제 참조 값을 갖고 있음

### Refs(참조) vs State(상태)

- 참조: 참조 값이 바뀔 때마다 컴포넌트 함수가 재실행되지 않음
- 상태: 상태가 업데이트 될 때마다 컴포넌트 함수가 재실행됨

### 상태

#### 상태는 UI에 바로 반영되어야 하는 값이 있을 때만 사용해야 함

#### 시스템 내부에 보이지 않는 쪽에서만 다루는 값이나, UI에 직접적인 영향을 끼치지 않는 값들을 갖고 있을 때는 사용을 지양해야 함

### 참조

#### 참조 값이 바뀌더라도 컴포넌트들이 재실행 되지 않음

#### DOM 요소에 직접적인 접근이 필요할 때 사용해야 함함

## forwardRef (참조 전달)

### forwardRef를 활용해 모달 컴포넌트 만들기

- 참조를 컴포넌트에서 컴포넌트로 전달해 다른 컴포넌트에서 참조를 사용할 수 있게 함
- 기본적으로 참조는 다른 컴포넌트로 전달할 수 없음

```jsx
import { useState, useRef } from "react"

import ResultModal from "./ResultModal"

export default function TimerChallenge({ title, targetTime }) {
  const timer = useRef()
  const dialog = useRef()

  const [timerStarted, setTimerStarted] = useState(false)
  const [timerExpired, setTimerExpired] = useState(false)

  function handleStart() {
    timer.current = setTimeout(() => {
      setTimerExpired(true)
      dialog.current.showModal()
    }, targetTime * 1000)

    setTimerStarted(true)
  }

  function handleStop() {
    clearTimeout(timer.current)
  }

  return (
    <>
      {/* showModal()을 사용하면 조건 렌더링 할 필요 없음 
            기본적으로 ref(참조)는 다른 컴포넌트로 전달 불가능함
            단 리액트가 제공하는 forwardRef를 사용하면 가능 */}
      <ResultModal ref={dialog} targetTime={targetTime} result="lost" />
      <section className="challenge">
        <h2>{title}</h2>
        {timerExpired && <p>You lost!</p>}
        <p className={"challenge-time"}>
          {targetTime} second{targetTime > 1 ? "s" : ""}
        </p>
        <p>
          <button onClick={timerStarted ? handleStop : handleStart}>{timerStarted ? "Stop" : "Start"} Challenge</button>
        </p>
        <p className={timerStarted ? "active" : undefined}>{timerStarted ? "Time is running..." : "Timer inactive"}</p>
      </section>
    </>
  )
}
```

```jsx
import { forwardRef } from "react"

// 참조ref 속성을 받고 구조분해 해서는 안 됨.
// 대신 forwardRef 함수는 두번째 인자로 ref를 받음
const ResultModal = forwardRef(function ResultModal({ result, targetTime }, ref) {
  return (
    <dialog className="result-modal" ref={ref}>
      <h2>You {result}</h2>
      <p>
        The target time was <strong>{targetTime} seconds.</strong>
      </p>
      <p>
        You stopped the timer with <strong>x seconds left.</strong>
      </p>
      <form method="dialog">
        <button>Close</button>
      </form>
    </dialog>
  )
})

export default ResultModal
```

### useImperativeHandle를 사용해 조금 더 개선하기

```jsx
import { useState, useRef } from "react"

import ResultModal from "./ResultModal"

export default function TimerChallenge({ title, targetTime }) {
  const timer = useRef()
  const dialog = useRef()

  const [timerStarted, setTimerStarted] = useState(false)
  const [timerExpired, setTimerExpired] = useState(false)

  function handleStart() {
    timer.current = setTimeout(() => {
      setTimerExpired(true)
      dialog.current.open()
    }, targetTime * 1000)

    setTimerStarted(true)
  }

  function handleStop() {
    clearTimeout(timer.current)
  }

  return (
    <>
      <ResultModal ref={dialog} targetTime={targetTime} result="lost" />
      <section className="challenge">
        <h2>{title}</h2>
        {timerExpired && <p>You lost!</p>}
        <p className={"challenge-time"}>
          {targetTime} second{targetTime > 1 ? "s" : ""}
        </p>
        <p>
          <button onClick={timerStarted ? handleStop : handleStart}>{timerStarted ? "Stop" : "Start"} Challenge</button>
        </p>
        <p className={timerStarted ? "active" : undefined}>{timerStarted ? "Time is running..." : "Timer inactive"}</p>
      </section>
    </>
  )
}
```

```jsx
import { useRef, forwardRef, useImperativeHandle } from "react"

const ResultModal = forwardRef(function ResultModal({ result, targetTime }, ref) {
  const dialog = useRef()

  useImperativeHandle(ref, () => ({
    open() {
      dialog.current.showModal()
    },
  }))

  return (
    <dialog className="result-modal" ref={dialog}>
      <h2>You {result}</h2>
      <p>
        The target time was <strong>{targetTime} seconds.</strong>
      </p>
      <p>
        You stopped the timer with <strong>x seconds left.</strong>
      </p>
      <form method="dialog">
        <button>Close</button>
      </form>
    </dialog>
  )
})

export default ResultModal
```

## dialog 태그

```jsx
import { useState, useRef } from "react"

export default function Player() {
  const playerName = useRef("")

  const [enteredPlayerName, setEnteredPlayerName] = useState(null)

  function handleClick() {
    setEnteredPlayerName(playerName.current.value)
    playerName.current.value = ""
  }

  return (
    <section id="player">
      <h2>Welcome {enteredPlayerName ?? "unknown entity"}</h2>
      <p>
        <input ref={playerName} type="text" />
        <button onClick={handleClick}>Set Name</button>
      </p>
    </section>
  )
}
```

```jsx
import { useState, useRef } from "react"

import ResultModal from "./ResultModal"

export default function TimerChallenge({ title, targetTime }) {
  const timer = useRef()
  const dialog = useRef()

  const [timeRemaining, setTimeRemaining] = useState(targetTime * 1000)

  const timerIsActive = timeRemaining > 0 && timeRemaining < targetTime * 1000

  if (timeRemaining <= 0) {
    clearInterval(timer.current)
    dialog.current.open()
  }

  function handleStart() {
    timer.current = setInterval(() => {
      setTimeRemaining((prevTimeRemaining) => {
        return prevTimeRemaining - 10
      })
    }, 10)
  }

  function handleStop() {
    dialog.current.open()
    clearInterval(timer.current)
  }

  function handleReset() {
    setTimeRemaining(targetTime * 1000)
  }

  return (
    <>
      <ResultModal ref={dialog} targetTime={targetTime} remainingTime={timeRemaining} onReset={handleReset} />
      <section className="challenge">
        <h2>{title}</h2>
        <p className={"challenge-time"}>
          {targetTime} second{targetTime > 1 ? "s" : ""}
        </p>
        <p>
          <button onClick={timerIsActive ? handleStop : handleStart}>{timerIsActive ? "Stop" : "Start"} Challenge</button>
        </p>
        <p className={timerIsActive ? "active" : undefined}>{timerIsActive ? "Time is running..." : "Timer inactive"}</p>
      </section>
    </>
  )
}
```

```jsx
import { useRef, forwardRef, useImperativeHandle } from "react"

const ResultModal = forwardRef(function ResultModal({ targetTime, remainingTime, onReset }, ref) {
  const dialog = useRef()

  const userLost = remainingTime <= 0
  const formattedRemainingTime = (remainingTime / 1000).toFixed(2) // 소수점 둘째 자리까지
  const score = Math.round((1 - remainingTime / (targetTime * 1000)) * 100)

  useImperativeHandle(ref, () => ({
    open() {
      dialog.current.showModal()
    },
  }))

  return (
    // <dialog>를 사용하면 esc눌러 모달을 닫을 수 있음
    // 하지만 close 버튼으로 닫는 것이 아니기에 form의 onSubmit이 호출되지 않음
    // dialog에 onClose 속성을 추가하면 esc 누르는 것으로 함수 호출 가능능
    <dialog className="result-modal" ref={dialog} onClose={onReset}>
      {userLost && <h2>You lost</h2>}
      {!userLost && <h2>Your Score: {score}</h2>}
      <p>
        The target time was <strong>{targetTime} seconds.</strong>
      </p>
      <p>
        You stopped the timer with <strong>{formattedRemainingTime} seconds left.</strong>
      </p>
      <form method="dialog" onSubmit={onReset}>
        <button>Close</button>
      </form>
    </dialog>
  )
})

export default ResultModal
```

## Portals

- 위에서 만든 코드에서, 모달은 TimerChallenge 컴포넌트와 같은 위치에서 출력되고 있음
- 모달이 같은 층에 존재하기보다는, 더 높은 층위에 있어야 보이는 것과 같아아 직관적임
- 작은 규모의 프로젝트에서는 문제 없지만, 커지면 형식 문제가 발생할 수 있음
- 포털은 렌더링이 될 html 코드를 DOM 내의 다른 곳으로 옮기는 역할
- createPortal의 첫번째 인자는 jsx 코드, 두번째 인자는 html 요소

```html
<!-- index.html -->

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
  </head>
  <body>
    <div id="modal"></div>
    <div id="content">
      <header>
        <h1>
          The
          <em>Almost</em>
          Final Countdown
        </h1>
        <p>Stop the timer once you estimate that time is (almost) up</p>
      </header>
      <div id="root"></div>
    </div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

```jsx
import { useRef, forwardRef, useImperativeHandle } from "react"
import { createPortal } from "react-dom"

const ResultModal = forwardRef(function ResultModal({ targetTime, remainingTime, onReset }, ref) {
  const dialog = useRef()

  const userLost = remainingTime <= 0
  const formattedRemainingTime = (remainingTime / 1000).toFixed(2) // 소수점 둘째 자리까지
  const score = Math.round((1 - remainingTime / (targetTime * 1000)) * 100)

  useImperativeHandle(ref, () => ({
    open() {
      dialog.current.showModal()
    },
  }))

  return createPortal(
    <dialog className="result-modal" ref={dialog} onClose={onReset}>
      {userLost && <h2>You lost</h2>}
      {!userLost && <h2>Your Score: {score}</h2>}
      <p>
        The target time was <strong>{targetTime} seconds.</strong>
      </p>
      <p>
        You stopped the timer with <strong>{formattedRemainingTime} seconds left.</strong>
      </p>
      <form method="dialog" onSubmit={onReset}>
        <button>Close</button>
      </form>
    </dialog>,
    document.getElementById("modal")
  )
})

export default ResultModal
```
