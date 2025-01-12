# 12

## memo()

- 컴포넌트 함수가 정상적으로 다시 실행될 때, memo가 이전 속성 값과 새로 받을 속성 값을 비교함
- 만약 이전과 새로 받은 속성 값(메모리 안의 객체나 배열)들이 완전히 동일하다면, 컴포넌트 함수가 새로 실행되는 것을 저지함
- 모든 컴포넌트를 memo로 감싸는 것은, 모든 속성 값을 비교하게 되어 성능에 영향을 줄 수 있으므로 추천하지 않음
- 재 렌더링을 방지할 수 있고, 최대한 상위 컴포넌트를 감싸는 것을 추천 (하위는 알아서 적용되니)
- 아니면 컴포넌트를 분리해서 최대한 영향을 끼치지 않게끔 하는 것을 추천

```jsx
import { useState, memo } from "react"

const Counter = memo(function Counter() {
  return (
    <section className="counter">
      <p className="counter-info">The initial counter value</p>
    </section>
  )
})

export default Counter
```

### 아래의 경우에서는 왜 적용이 안 되는가

```jsx
import { memo } from "react"

import { log } from "../../log.js"

const IconButton = memo(function IconButton({ children, icon, ...props }) {
  log("<IconButton /> rendered", 2)

  const Icon = icon
  return (
    <button {...props} className="button">
      <Icon className="button-icon" />
      <span className="button-text">{children}</span>
    </button>
  )
})

export default IconButton
```

#### IconButton이 Counter.jsx로부터 ...props로 전달받는 onClick 함수 때문

- Counter 컴포넌트 안에서 생성된 함수들임
- 즉 Counter 컴포넌트가 실행될 때마다 함수들이 재생성됨:
  - memo는 이를 새 속성 값으로 받아들임
- useCallback Hook을 이용하면 해결 가능

```jsx
import { useState, memo, useCallback } from "react"

import IconButton from "../UI/IconButton.jsx"
import MinusIcon from "../UI/Icons/MinusIcon.jsx"
import PlusIcon from "../UI/Icons/PlusIcon.jsx"
import CounterOutput from "./CounterOutput.jsx"
import { log } from "../../log.js"

function isPrime(number) {
  log("Calculating if is prime number", 2, "other")
  if (number <= 1) {
    return false
  }

  const limit = Math.sqrt(number)

  for (let i = 2; i <= limit; i++) {
    if (number % i === 0) {
      return false
    }
  }

  return true
}

const Counter = memo(function Counter({ initialCount }) {
  log("<Counter /> rendered", 1)
  const initialCountIsPrime = isPrime(initialCount)

  const [counter, setCounter] = useState(initialCount)

  const handleDecrement = useCallback(function handleDecrement() {
    setCounter((prevCounter) => prevCounter - 1)
  }, [])

  const handleIncrement = useCallback(function handleIncrement() {
    setCounter((prevCounter) => prevCounter + 1)
  }, [])

  return (
    <section className="counter">
      <p className="counter-info">
        The initial counter value was <strong>{initialCount}</strong>. It <strong>is {initialCountIsPrime ? "a" : "not a"}</strong> prime number.
      </p>
      <p>
        <IconButton icon={MinusIcon} onClick={handleDecrement}>
          Decrement
        </IconButton>
        <CounterOutput value={counter} />
        <IconButton icon={PlusIcon} onClick={handleIncrement}>
          Increment
        </IconButton>
      </p>
    </section>
  )
})

export default Counter
```

## useMemo()

- memo()는 컴포넌트 함수를 감싸는데 이용함
- useMemo()는 컴포넌트 안의 일반 함수를 감쌀 때 사용함
- 첫번째 인자로 함수, 두번쨰로 의존성 배열을 전달 받음
- 복잡한 계산이 있을 때만 사용하는 것이 좋음
- memo() 훅과 마찬가지로, 의존성 값 비교를 해야하기 때문에 남용해서는 안 됨.

```jsx
const initialCountIsPrime = useMemo(() => {
  return isPrime(initialCount)
}, [initialCount])
```

- 위 isPrime 함수는 initialCount 값이 바뀔 경우에만 실행될 것

## Million.js

`npm install @million/lint@latest`

```js
// vite.config.js
import MillionLint from "@million/lint"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [MillionLint.vite()],
})
```
