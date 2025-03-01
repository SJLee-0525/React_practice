import classes from "./NewTodo.module.css"

import React, { useContext, useRef } from "react"

import { TodosContext } from "../store/todos-context"

const NewTodo: React.FC = () => {
  const todosCtx = useContext(TodosContext)

  const textInputRef = useRef<HTMLInputElement>(null)

  function submitHandler(event: React.FormEvent) {
    event.preventDefault()

    // ?. 값에 접근해 보고, 가능하다면 입력된 값을 가져와 enteredText에 할당하고, 불가능하다면 null을 할당 -> (string | undefined) 타입.
    // !. 값에 접근해 보고, 가능하다면 입력된 값을 가져와 enteredText에 할당하고, 불가능하다면 오류를 발생시킵니다. -> string 타입.
    const enteredText = textInputRef.current!.value

    if (enteredText.trim().length === 0) {
      return alert("Please enter a valid text.")
    }

    todosCtx.addTodo(enteredText)
  }

  return (
    <form onSubmit={submitHandler} className={classes.form}>
      <label htmlFor="text">Todo text</label>
      <input type="text" id="text" ref={textInputRef} />
      <button>Add Todo</button>
    </form>
  )
}

export default NewTodo
