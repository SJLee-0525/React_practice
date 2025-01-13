# 14

## React Hooks

### 규칙

1. React 컴포넌트 함수 내에서만 사용해야 함
2. If 조건문에 포함되어서는 안 됨

## Custom Hooks

### 아래 두 코드는 상당히 유사함

```jsx
// App.jsx

useEffect(() => {
  async function fetchPlaces() {
    setIsFetching(true)
    try {
      const places = await fetchUserPlaces()
      setUserPlaces(places)
    } catch (error) {
      setError({ message: error.message || "Failed to fetch user places." })
    }

    setIsFetching(false)
  }

  fetchPlaces()
}, [])
```

```jsx
// AvailablePlaces.jsx

useEffect(() => {
  async function fetchPlaces() {
    setIsFetching(true)

    try {
      const places = await fetchAvailablePlaces()

      navigator.geolocation.getCurrentPosition((position) => {
        const sortedPlaces = sortPlacesByDistance(places, position.coords.latitude, position.coords.longitude)
        setAvailablePlaces(sortedPlaces)
        setIsFetching(false)
      })
    } catch (error) {
      setError({
        message: error.message || "Could not fetch places, please try again later.",
      })
      setIsFetching(false)
    }
  }
})
```

### 커스텀 훅을 사용하면 이같은 중복을 피할 수 있음

```jsx
// App.jsx

import { useRef, useState, useCallback } from "react"

import Places from "./components/Places.jsx"
import Modal from "./components/Modal.jsx"
import DeleteConfirmation from "./components/DeleteConfirmation.jsx"
import logoImg from "./assets/logo.png"
import AvailablePlaces from "./components/AvailablePlaces.jsx"
import { fetchUserPlaces, updateUserPlaces } from "./http.js"
import Error from "./components/Error.jsx"

import { useFetch } from "./hooks/useFetch.js"

function App() {
  const selectedPlace = useRef()

  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState()

  const [modalIsOpen, setModalIsOpen] = useState(false)

  const { isFetching, errorState, fetchedData: userPlaces, setFetchedData: setUserPlaces } = useFetch(fetchUserPlaces, [])

  function handleStartRemovePlace(place) {
    setModalIsOpen(true)
    selectedPlace.current = place
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false)
  }

  async function handleSelectPlace(selectedPlace) {
    await updateUserPlaces([selectedPlace, ...userPlaces])

    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = []
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces
      }
      return [selectedPlace, ...prevPickedPlaces]
    })

    try {
      await updateUserPlaces([selectedPlace, ...userPlaces])
    } catch (error) {
      setUserPlaces(userPlaces)
      setErrorUpdatingPlaces({
        message: error.message || "Failed to update places.",
      })
    }
  }

  const handleRemovePlace = useCallback(
    async function handleRemovePlace() {
      setUserPlaces((prevPickedPlaces) => prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id))

      try {
        await updateUserPlaces(userPlaces.filter((place) => place.id !== selectedPlace.current.id))
      } catch (error) {
        setUserPlaces(userPlaces)
        setErrorUpdatingPlaces({
          message: error.message || "Failed to delete place.",
        })
      }

      setModalIsOpen(false)
    },
    [userPlaces, setUserPlaces]
  )

  function handleError() {
    setErrorUpdatingPlaces(null)
  }

  return (
    <>
      <Modal open={errorUpdatingPlaces} onClose={handleError}>
        {errorUpdatingPlaces && <Error title="An error occurred!" message={errorUpdatingPlaces.message} onConfirm={handleError} />}
      </Modal>

      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation onCancel={handleStopRemovePlace} onConfirm={handleRemovePlace} />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>Create your personal collection of places you would like to visit or you have visited.</p>
      </header>
      <main>
        {errorState && <Error title="An error occurred!" message={error.message} />}
        {!errorState && (
          <Places
            title="I'd like to visit ..."
            fallbackText="Select the places you would like to visit below."
            isLoading={isFetching}
            loadingText="Fetching your places..."
            places={userPlaces}
            onSelectPlace={handleStartRemovePlace}
          />
        )}

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  )
}

export default App
```

```jsx
// AvailablePlaces.jsx

import Places from "./Places.jsx"
import Error from "./Error.jsx"
import { sortPlacesByDistance } from "../loc.js"
import { fetchAvailablePlaces } from "../http.js"

import { useFetch } from "../hooks/useFetch.js"

async function fetchSortedPlaces() {
  const places = await fetchAvailablePlaces()

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(places, position.coords.latitude, position.coords.longitude)

      resolve(sortedPlaces)
    })
  })
}

export default function AvailablePlaces({ onSelectPlace }) {
  const { isFetching, errorState: error, fetchedData: availablePlaces } = useFetch(fetchSortedPlaces, [])

  if (error) {
    return <Error title="An error occurred!" message={error.message} />
  }

  return <Places title="Available Places" places={availablePlaces} isLoading={isFetching} loadingText="Fetching place data..." fallbackText="No places available." onSelectPlace={onSelectPlace} />
}
```

```jsx
// hooks/useFetch.js

import { useEffect, useState } from "react"

export function useFetch(fetchFn, initialValue) {
  const [isFetching, setIsFetching] = useState()
  const [errorState, setErrorState] = useState()
  const [fetchedData, setFetchedData] = useState(initialValue)

  useEffect(() => {
    async function fetchData() {
      setIsFetching(true)
      try {
        const data = await fetchFn()
        setFetchedData(data)
      } catch (error) {
        setErrorState({ message: error.message || "Failed to fetch data." })
      }

      setIsFetching(false)
    }

    fetchData()
  }, [fetchFn])

  return {
    isFetching,
    errorState,
    fetchedData,
    setFetchedData,
  }
}
```

#### 주의점

- 함수 이름은 use로 시작할 것
  - 그래야 react에서 훅으로 인식함
- 커스텀 훅도 함수이기에, parameter를 통해 인자를 받을 수 있음
