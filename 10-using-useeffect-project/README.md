# 10

## Side Effect (부수 효과)

- 앱이 제대로 동작하기 위해 실행되어야 하지만, 현재의 컴포넌트 렌더링에 직접적인 영향을 미치지 않는 작업
- 해당 프로젝트의 APP.jsx에서의 아래 함수와 같이, 컴포넌트에 직접적인 영향을 미치지 않는 것들을 의미

```jsx
navigator.geolocation.getCurrentPosition((position) => {
  const sortedPlaces = sortPlacesByDistance(AVAILABLE_PLACES, position.coords.latitude, position.coords.longitude)
})
```

## useEffect

- 컴포넌트가 출력된 후, 이후에 추가 작업을 진행하는 방식
- 모든 부수 효과에 useEffect를 사용하는 것은 좋지 않음
- useEffect(함수, 의존성)

## 의존성(Dependencies)

- 컴포넌트를 다시 실행하게끔 하는 속성이나 상태 값
- 빈 배열을 추가한다면 의존성이 존재하지 않으므로, 추후 실행될 일이 없음

```jsx
// useEffect는 값을 반환하지는 않으나, 2개의 인자가 필요
useEffect(() => {
  // 브라우저에서 제공하는 위치 제공 함수
  navigator.geolocation.getCurrentPosition((position) => {
    const sortedPlaces = sortPlacesByDistance(AVAILABLE_PLACES, position.coords.latitude, position.coords.longitude)

    setAvailablePlaces(sortedPlaces)
  })
}, [])
```

- 아래와 같은 경우 open의 값이 변경될 때마다 useEffect내에 정의된 함수가 실행됨

```jsx
useEffect(() => {
  if (open) {
    dialog.current.showModal()
  } else {
    dialog.current.close()
  }
}, [open])
```

- 해당 의존성에 함수를 집어넣을 수도 있음
- 자바 스크립트에서 함수는 객체이기 떄문
- 단 무한루프의 위험에 빠질 가능성이 큼
- 컴포넌트가 재실행될 때 컴포넌트 내의 객체들도 재실행 및 재생성됨
- 그 함수를 다른 컴포넌트에서 받으면 실제 의존성이 바뀌지 않았음에도 리액트는 새로운 값, 새로운 함수로 보게되고 이전의 값과 다르다고 판단해 컴포넌트를 재실행하게 됨

## useCallback

- useEffect와 마찬가지로 함수와 의존성 배열을 인자로 받음
- useCallback은 안쪽에 있는 함수가 재생성되지 않게끔 도와줌
- 대신 함수를 메모리에 저장하고, 컴포넌트가 재실행될 떄마다 메모리에 저장된 함수를 재사용함

```jsx
const handleRemovePlace = useCallback(function handleRemovePlace() {
  setPickedPlaces((prevPickedPlaces) => prevPickedPlaces.filter((place) => place.id !== selectedPlace.current))
  setModalIsOpen(false)

  const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || []
  localStorage.setItem(
    "selectedPlaces",
    JSON.stringify(
      storedIds.filter((id) => {
        return id !== selectedPlace.current
      })
    )
  )
}, [])
```

### 타이머 만들기

- 아래와 같은 경우, 10ms마다 해당 컴포넌트를 재실행하므로 되도록 타이머와 같은 컴포넌트를 분리하는게 좋긴 함

```jsx
import { useState, useEffect } from "react"

const TIMER = 3000

export default function DeleteConfirmation({ onConfirm, onCancel }) {
  const [remainingTime, setRemainingTime] = useState(TIMER)

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prevTime) => {
        return prevTime - 10
      })
    }, 10)

    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    console.log("Timer Set")
    const timer = setTimeout(() => {
      onConfirm()
    }, TIMER)

    return () => {
      console.log("Timer Off")
      clearTimeout(timer)
    }
  }, [onConfirm])

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <progress value={remainingTime} max={TIMER} />
    </div>
  )
}
```

#### 분리된 버전

```jsx
// ProgressBar.jsx

import { useState, useEffect } from "react"

export default function ProgressBar({ timer }) {
  const [remainingTime, setRemainingTime] = useState(timer)

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prevTime) => {
        return prevTime - 10
      })
    }, 10)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return <progress value={remainingTime} max={timer} />
}
```

```jsx
// DeleteConfirmation.jsx

import { useState, useEffect } from "react"

import ProgressBar from "./ProgressBar.jsx"

const TIMER = 3000

export default function DeleteConfirmation({ onConfirm, onCancel }) {
  useEffect(() => {
    console.log("Timer Set")
    const timer = setTimeout(() => {
      onConfirm()
    }, TIMER)

    return () => {
      console.log("Timer Off")
      clearTimeout(timer)
    }
  }, [onConfirm])

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <ProgressBar timer={TIMER} />
    </div>
  )
}
```
