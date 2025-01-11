import { useRef, useState, useEffect, useCallback } from "react"

import Places from "./components/Places.jsx"
import { AVAILABLE_PLACES } from "./data.js"
import Modal from "./components/Modal.jsx"
import DeleteConfirmation from "./components/DeleteConfirmation.jsx"
import logoImg from "./assets/logo.png"
import { sortPlacesByDistance } from "./loc.js"

const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || []
const storedPlaces = storedIds.map((id) => {
  return AVAILABLE_PLACES.find((place) => {
    return place.id === id
  })
})

function App() {
  const selectedPlace = useRef()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [availablePlaces, setAvailablePlaces] = useState([])
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces)

  // useEffect는 값을 반환하지는 않으나, 2개의 인자가 필요
  useEffect(() => {
    // 브라우저에서 제공하는 위치 제공 함수
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(AVAILABLE_PLACES, position.coords.latitude, position.coords.longitude)

      setAvailablePlaces(sortedPlaces)
    })
  }, [])

  function handleStartRemovePlace(id) {
    setModalIsOpen(true)
    selectedPlace.current = id
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false)
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id)
      return [place, ...prevPickedPlaces]
    })

    // 브라우저의 스토리지에서 식별자를 이용해 문자열 형태로 된 배열을 받아오기
    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || []
    if (storedIds.indexOf(id) === -1) {
      // 브라우저의 스토리지에 식별자와 함께 새 배열 담기
      localStorage.setItem("selectedPlaces", JSON.stringify([id, ...storedIds]))
    }
  }

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

  return (
    <>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation onCancel={handleStopRemovePlace} onConfirm={handleRemovePlace} />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>Create your personal collection of places you would like to visit or you have visited.</p>
      </header>
      <main>
        <Places title="I'd like to visit ..." fallbackText={"Select the places you would like to visit below."} places={pickedPlaces} onSelectPlace={handleStartRemovePlace} />
        <Places title="Available Places" places={availablePlaces} onSelectPlace={handleSelectPlace} />
      </main>
    </>
  )
}

export default App
