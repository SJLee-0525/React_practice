import { useRef, useState, useEffect, useCallback } from "react"

import ErrorPage from "./components/Error.jsx"
import Places from "./components/Places.jsx"
import Modal from "./components/Modal.jsx"
import DeleteConfirmation from "./components/DeleteConfirmation.jsx"
import logoImg from "./assets/logo.png"
import AvailablePlaces from "./components/AvailablePlaces.jsx"

import { fetchUserPlaces, updateUserPlaces } from "./http.js"

function App() {
  const selectedPlace = useRef()

  const [userPlaces, setUserPlaces] = useState([])
  const [isFetchingUserPlaces, setIsFetchingUserPlaces] = useState(false)
  const [errorState, setErrorState] = useState()

  const [errorUpdatingPlaces, SetErrorUpdatingPlaces] = useState()

  const [modalIsOpen, setModalIsOpen] = useState(false)

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

  function handleStartRemovePlace(place) {
    setModalIsOpen(true)
    selectedPlace.current = place
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false)
  }

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

      console.log(message)
    } catch (error) {
      // 요청에 실패할 경우, 그 전의 상태로 다시 되돌림 (먼저 UI에 반영했으니까.)
      setUserPlaces(userPlaces)
      SetErrorUpdatingPlaces({ message: error.message || "Failed to update places." })
    }
  }

  function handleError() {
    SetErrorUpdatingPlaces(null)
  }

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

  return (
    <>
      <Modal open={errorUpdatingPlaces} onClose={handleError}>
        {errorUpdatingPlaces && <ErrorPage title="An error occured!" message={errorUpdatingPlaces.message} onConfirm={handleError} />}
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
        {errorState && <ErrorPage title="An error occurred" message={errorState.message} />}
        {!errorState && (
          <Places
            title="I'd like to visit ..."
            fallbackText="Select the places you would like to visit below."
            isLoading={isFetchingUserPlaces}
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
