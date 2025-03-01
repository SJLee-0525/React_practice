import classes from "./Todos.module.css"

import React, { useContext } from "react"

import { TodosContext } from "../store/todos-context"

import TodoItem from "./TodoItem"

const Todos: React.FC = () => {
  const todosCtx = useContext(TodosContext)

  return (
    <ul className={classes.todos}>
      {todosCtx.items.map((item) => {
        return (
          <TodoItem
            key={item.id}
            text={item.text}
            // bind() 메서드는 실행할 함수를 미리 설정할 수 있음
            // 먼저 이 키워드가 호출될 함수 안에서 무엇을 가리키는지 지정하고 (null)
            // 그 다음에는 함수에 전달할 인수를 지정 (item.id)
            onRemoveTodo={todosCtx.removeTodo.bind(null, item.id)}
          />
        )
      })}
    </ul>
  )
}

export default Todos
