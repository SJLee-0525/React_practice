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
