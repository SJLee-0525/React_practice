import React from "react"

import { useState } from "react"

import Todo from "../models/todos"

type TodoContextObj = {
  items: Todo[]
  addTodo: (text: string) => void
  removeTodo: (id: string) => void
}

export const TodosContext = React.createContext<TodoContextObj>({
  items: [],
  addTodo: () => {},
  removeTodo: (id: string) => {},
})

const TodosContextProvider: React.FC<{ children: React.ReactNode }> = (
  props
) => {
  const [todos, setTodos] = useState<Todo[]>([])

  const addTodoHandler = (text: string) => {
    const newTodo = new Todo(text)

    setTodos((prevTodo) => {
      // concat() 메서드는 배열을 합쳐서 새로운 배열을 반환.
      return prevTodo.concat(newTodo)
    })
  }

  const removeTodoHandler = (todoId: string) => {
    setTodos((prevTodo) => {
      // filter() 메서드는 주어진 함수의 테스트를 통과하는 모든 요소를 모아 새로운 배열로 반환.
      return prevTodo.filter((todo) => todo.id !== todoId)
    })
  }

  const contextValue: TodoContextObj = {
    items: todos,
    addTodo: addTodoHandler,
    removeTodo: removeTodoHandler,
  }

  return (
    <TodosContext.Provider value={contextValue}>
      {props.children}
    </TodosContext.Provider>
  )
}

export default TodosContextProvider
