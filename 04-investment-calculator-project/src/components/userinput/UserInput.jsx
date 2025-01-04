import { useState } from "react"

export default function UserInput({ data, inputName, onChangeInputValue, children }) {
  return (
    <p>
      <label>{children}</label>
      <input type="number" onChange={(event) => onChangeInputValue(inputName, event.target.value)} value={data} required />
    </p>
  )
}
