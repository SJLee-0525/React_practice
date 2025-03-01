import "./App.css"

import TodosContextProvider from "./store/todos-context.tsx"

import NewTodo from "./components/NewTodo.tsx"
import Todos from "./components/Todos.jsx"

function App() {
  return (
    <TodosContextProvider>
      <NewTodo />
      <Todos />
    </TodosContextProvider>
  )
}

export default App
