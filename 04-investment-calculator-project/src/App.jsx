import { useState } from "react"

import { calculateInvestmentResults, formatter } from "./util/investment.js"

import UserInput from "./components/userinput/UserInputGroup.jsx"
import Result from "./components/result/Result.jsx"

const initialInvestmentData = {
  initialInvestment: 10000,
  annualInvestment: 1200,
  expectedReturn: 6,
  duration: 10,
}

function App() {
  const [investmentData, setInvestmentData] = useState(initialInvestmentData)

  const inputIsValid = investmentData.duration > 0

  function handleInputValueChange(inputTarget, inputValue) {
    setInvestmentData((prevInvestmentData) => {
      const numericInputValue = Number(inputValue)

      return { ...prevInvestmentData, [inputTarget]: numericInputValue }
    })
  }

  return (
    <>
      <UserInput investmentData={investmentData} onChangeInputValue={handleInputValueChange} />
      {inputIsValid ? <Result investmentData={investmentData} /> : <p className="center">Please enter a duration greater than zero.</p>}
    </>
  )
}

export default App
