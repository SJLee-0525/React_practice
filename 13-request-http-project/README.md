# 13

## fetch()

- 브라우저에서 제공하는 함수
- HTTP 요청을 다른 서버로 보내는데 사용

### 기본 사용법

```jsx
import { useState } from "react"

import Places from "./Places.jsx"

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([])

  fetch("http://localhost:3000/places")
    .then((response) => {
      return response.json()
    })
    .then((resData) => {
      setAvailablePlaces(resData.places)
    })

  return <Places title="Available Places" places={availablePlaces} fallbackText="No places available." onSelectPlace={onSelectPlace} />
}
```

- 위처럼 fetch 요청을 컴포넌트 함수에 직접적으로 불러오는 것은 문제가 있음
- 컴포넌트가 실행될 때마다 요청이 보내짐
- 두번쨰 then 블록에서 상태를 업데이트하는데, 컴포넌트 함수를 또 실행하게 되어 무한 루프의 문제가 생김

### useEffect로 GET 요청

- Effect 함수는 의존성이 바뀌었다는 전제 하에 컴포넌트 함수가 실행된 직후 실행됨
- 아래 코드는 의존성이 없기 때문에, 딱 한 번만 실행될 것이기에 무한 루프의 문제가 해결

```jsx
import { useState, useEffect } from "react"

import Places from "./Places.jsx"

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([])

  useEffect(() => {
    fetch("http://localhost:3000/places")
      .then((response) => {
        return response.json()
      })
      .then((resData) => {
        setAvailablePlaces(resData.places)
      })
  }, [])

  return <Places title="Available Places" places={availablePlaces} fallbackText="No places available." onSelectPlace={onSelectPlace} />
}
```

### async, await 사용하기

- await는 async(비동기)를 사용한 함수에서만 사용 가능함
- effect 함수에서 비동기로 정의하고 사용하기

```jsx
import { useState, useEffect } from "react"

import Places from "./Places.jsx"

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([])

  useEffect(() => {
    async function fetchPlaces() {
      const response = await fetch("http://localhost:3000/places")
      const resData = await response.json()
      setAvailablePlaces(resData.places)
    }

    fetchPlaces()
  }, [])

  return <Places title="Available Places" places={availablePlaces} fallbackText="No places available." onSelectPlace={onSelectPlace} />
}
```

### 로딩 상태 표시하기

```jsx
import { useState, useEffect } from "react"

import Places from "./Places.jsx"

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false)
  const [availablePlaces, setAvailablePlaces] = useState([])
  const [errorState, setErrorState] = useState()

  useEffect(() => {
    setIsFetching(true)

    async function fetchPlaces() {
      try {
        const response = await fetch("http://localhost:3000/places")
        const resData = await response.json()

        if (!response.ok) {
          // 400 500
          const error = new Error("Failed to fetch places")
          throw error
        }

        setAvailablePlaces(resData.places)
      } catch (error) {
        setErrorState(error)
      }

      setIsFetching(false)
    }

    fetchPlaces()
  }, [])

  return <Places title="Available Places" places={availablePlaces} isLoading={isFetching} loadingText="Fetching place data..." fallbackText="No places available." onSelectPlace={onSelectPlace} />
}
```

## 에러 다루기

- 3가지의 상태 필요함
- response.ok로 응답 점검 가능

```jsx
import { useState, useEffect } from "react"

import Places from "./Places.jsx"
import ErrorPage from "./Error.jsx"

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false)
  const [availablePlaces, setAvailablePlaces] = useState([])
  const [errorState, setErrorState] = useState()

  useEffect(() => {
    setIsFetching(true)

    async function fetchPlaces() {
      try {
        const response = await fetch("http://localhost:3000/places")
        const resData = await response.json()

        if (!response.ok) {
          // 400 500
          const error = new Error("Failed to fetch places")
          throw error
        }

        setAvailablePlaces(resData.places)
      } catch (error) {
        setErrorState({ message: error.message || "Could not fetch places, please try again later." })
      }

      setIsFetching(false)
    }

    fetchPlaces()
  }, [])

  if (errorState) {
    return <ErrorPage title="An error occured!" message={errorState.message} />
  }

  return <Places title="Available Places" places={availablePlaces} isLoading={isFetching} loadingText="Fetching place data..." fallbackText="No places available." onSelectPlace={onSelectPlace} />
}
```

### fetch받은 데이터를 사용해서 변환하기

```jsx
import { useState, useEffect } from "react"

import Places from "./Places.jsx"
import ErrorPage from "./Error.jsx"

import { sortPlacesByDistance } from "../loc.js"

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false)
  const [availablePlaces, setAvailablePlaces] = useState([])
  const [errorState, setErrorState] = useState()

  useEffect(() => {
    setIsFetching(true)

    async function fetchPlaces() {
      try {
        const response = await fetch("http://localhost:3000/places")
        const resData = await response.json()

        if (!response.ok) {
          // 400 500
          const error = new Error("Failed to fetch places")
          throw error
        }

        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(resData.places, position.coords.latitude, position.coords.longitude)

          setAvailablePlaces(sortedPlaces)
          setIsFetching(false)
        })
      } catch (error) {
        setErrorState({ message: error.message || "Could not fetch places, please try again later." })
        setIsFetching(false)
      }
    }

    fetchPlaces()
  }, [])

  if (errorState) {
    return <ErrorPage title="An error occured!" message={errorState.message} />
  }

  return <Places title="Available Places" places={availablePlaces} isLoading={isFetching} loadingText="Fetching place data..." fallbackText="No places available." onSelectPlace={onSelectPlace} />
}
```

### 요청 메서드 분리하기

```jsx
// http.js
export async function fetchAvailablePlaces() {
  const response = await fetch("http://localhost:3000/places")
  const resData = await response.json()

  if (!response.ok) {
    throw new Error("Failed to fetch places")
  }

  return resData.places
}
```

```jsx
// AvailablePlaces.jsx

import { useState, useEffect } from "react"

import Places from "./Places.jsx"
import ErrorPage from "./Error.jsx"

import { fetchAvailablePlaces } from "../http.js"
import { sortPlacesByDistance } from "../loc.js"

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false)
  const [availablePlaces, setAvailablePlaces] = useState([])
  const [errorState, setErrorState] = useState()

  useEffect(() => {
    setIsFetching(true)

    async function fetchPlaces() {
      try {
        const places = await fetchAvailablePlaces()

        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(places, position.coords.latitude, position.coords.longitude)

          setAvailablePlaces(sortedPlaces)
          setIsFetching(false)
        })
      } catch (error) {
        setErrorState({ message: error.message || "Could not fetch places, please try again later." })
        setIsFetching(false)
      }
    }

    fetchPlaces()
  }, [])

  if (errorState) {
    return <ErrorPage title="An error occured!" message={errorState.message} />
  }

  return <Places title="Available Places" places={availablePlaces} isLoading={isFetching} loadingText="Fetching place data..." fallbackText="No places available." onSelectPlace={onSelectPlace} />
}
```

### POST 요청 보내기

- body 속성에는 어떤 데이터를 첨부해야 하는지 정의
  - 이 때 자바 스크립트의 배열은 첨부할 수 있는 형식이 아니기에 JSON 변환이 필요
- headers 속성에는 요청에 첨부될 메타 데이터를 추가
  - 아래의 경우 요청에 첨부될 데이터가 JSON 형식이라고 백엔드에 알림

```js
// http.js

export async function updateUserPlaces(places) {
  const response = await fetch("http://localhost:3000/user-places", {
    method: "PUT",
    body: JSON.stringify({ places: places }),
    headers: {
      "Content-Type": "application/json",
    },
  })

  const resData = await response.json()

  if (!response.ok) {
    throw new Error("Failed to update user data.")
  }

  return resData.message
}
```

#### 낙관적 업데이트

- UI에 반영을 먼저하고 요청을 보내는 것.
- 요청이 끝날 때까지 기다리지 않기에, 로딩 문구나 스피너를 띄우지 않아도 괜찮음
- 때로는 더 나은 사용자 경험을 제공할 수 있음
- 단 에러가 발생할 경우, UI에 다시 반영해야 하고 사용자에게 설명을 해주는 것이 좋은 사용자 경험을 제공할 수 있음

```jsx
// App.jsx

const [userPlaces, setUserPlaces] = useState([])
const [errorUpdatingPlaces, SetErrorUpdatingPlaces] = useState()

// 낙관적 업데이트
async function handleSelectPlace(selectedPlace) {
  // 먼저 로컬 UI를 업데이트 하고
  setUserPlaces((prevPickedPlaces) => {
    if (!prevPickedPlaces) {
      prevPickedPlaces = []
    }
    if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
      return prevPickedPlaces
    }
    return [selectedPlace, ...prevPickedPlaces]
  })

  // 이후에 고른 장소를 백엔드로 보내기
  try {
    // 상태 업데이트는 즉각적으로 이루어지지 않기 때문에, 이전 상태를 사용해서 전송해야 함
    const message = await updateUserPlaces([selectedPlace, ...userPlaces])
  } catch (error) {
    // 요청에 실패할 경우, 그 전의 상태로 다시 되돌림 (먼저 UI에 반영했으니까.)
    setUserPlaces(userPlaces)
    SetErrorUpdatingPlaces({ message: error.message || "Failed to update places." })
  }
}
```

### 데이터 삭제 요청하기

- POST 요청에서 사용했던 updateUserPlaces 함수 재사용함
- 저장된 배열 내의 장소와 삭제 클릭된 장소를 비교해서 클릭되지 않은 애들만 배열에 담아서 새로 요청 보내는 방식

```jsx
// App.jsx

const handleRemovePlace = useCallback(
  async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) => prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id))

    try {
      const message = await updateUserPlaces(userPlaces.filter((place) => place.id !== selectedPlace.current.id))

      console.log("delete place")
    } catch (error) {
      setUserPlaces(userPlaces)
      SetErrorUpdatingPlaces({ message: error.message || "Failed to delete place." })
    }

    setModalIsOpen(false)
  },
  [userPlaces]
)
```

### 유저 데이터 가져오기

```jsx
// http.js

export async function fetchUserPlaces() {
  const response = await fetch("http://localhost:3000/user-places")
  const resData = await response.json()

  if (!response.ok) {
    throw new Error("Failed to fetch user places.")
  }

  return resData.places
}
```

```jsx
// App.jsx

const [userPlaces, setUserPlaces] = useState([])
const [isFetchingUserPlaces, setIsFetchingUserPlaces] = useState(false)
const [errorState, setErrorState] = useState()

useEffect(() => {
  async function fetchPlaces() {
    setIsFetchingUserPlaces(true)

    try {
      const resPlacesData = await fetchUserPlaces()
      setUserPlaces(resPlacesData)
    } catch (error) {
      setErrorState({ message: error.message || "Failed to fetch user places." })
    }

    setIsFetchingUserPlaces(false)
  }

  fetchPlaces()
}, [])
```
