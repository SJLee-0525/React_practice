import useHttp from "../../hooks/useHttp.js"

import Error from "../UI/Error.jsx"
import MealItem from "./MealItem.jsx"

const requestConfig = {}
// 컴포넌트 함수의 바깥에서 config로 전송될 객체를 생성해, 객체를 한 번만 생성하게끔 해서, 의존성에 의한 무한루프를 해결

export default function Meals() {
  const { data: loadedMeals, isLoading, error } = useHttp("http://localhost:3000/meals", requestConfig, [])
  // useHttp(url, config, initialData)

  if (isLoading) {
    return <p className="center">Fetching meals...</p>
  }

  if (error) {
    return <Error title="Failed to fetch meals" message={error} />
  }

  return (
    <ul id="meals">
      {loadedMeals.map((meal) => {
        return <MealItem key={meal.id} meal={meal} />
      })}
      <li></li>
    </ul>
  )
}
