# 32

## 타입 스크립트 vs 자바 스크립트

- 자바 스크립트의 슈퍼셋 언어: 자바스크립트를 기반으로 하되, 보다 확장된 프로그래밍 언어
- 자바 스크립트의 기본적인 문법 등을 그대로 사용
- 자바 스크립트보다 보다 확장된 문법을 가짐
- 타입 스크립트 (정적 타입) vs 자바 스크립트 (동적 타입)

## 기본형

타입 스크립트에서는 number와 string 표기가 소문자로 시작됨

### 숫자

```typeScript
let age: number = 24;
```

### 문자

```typeScript
let userName: string;
userName = "sungjoon";
```

### 논리

```typeScript
let isInstructor: boolean = true;

let isMarried: null;
```

## 참조형

### 배열

```typeScript
let hobbies: string[];
hobbies = ["Sports", "Cooking"];
```

any: 어떤 값이든 다 저장됨

```typeScript
let person;
person = {
  name: "Max",
  age: 32,
};
```

### 객체

```typeScript
let person: {
  name: string;
  age: number;
};

person = {
  name: "Max",
  age: 32,
};
```

### 여러 객체를 가진 배열 생성

```typeScript
let people: {
  name: string;
  age: number;
}[];
```

## 타입 추론

- 위에서는 변수를 선언하면서 타입을 지정하고 값을 할당하거나 동시에 설정했음
- 아래 처럼 변수를 바로 만들고 초기화하면, 타입 스크립트는 할당된 값의 자료형을 보고, 이 자료형을 해당 변수의 타입으로 여긺

```typeScript
let course = "React";

course = "123";
// course = 123
```

## 다양한 유형의 변수 저장하기: 유니온 타입

```typeScript
let course2: string | number | boolean = "React 2";

course2 = "123";
course2 = 123;
course2 = false;
```

## 타입 별칭 : Type Alias

반복해서 타입을 정의하는 대신에 기본 타입을 정의해 두고, 그 타입 별칭을 사용하는 것

```typeScript
type Student = {
  name: string;
  age: number;
};

let student1: Student = {
  name: "std1",
  age: 12,
};
let student2: Student[] = [
  {
    name: "std1",
    age: 12,
  },
  {
    name: "std2",
    age: 10,
  },
];
```

## 함수와 타입

### 함수(매개 변수): 리턴 값 타입

```typeScript
function add(a: number, b: number): number {
  return a + b;
}
```

### 반환 값이 없는 함수

void는 null, undefined와 비슷하지만, 항상 함수와 결합해서 사용함

```typeScript
function personalPrint(value: any): void {
  console.log(value);
}
```

### 제너릭 Generics

- 함수를 호출하면 타입 스크립트는 인수의 정확한 값을 파악해야 한다는 것을 알 수 있음
- any 타입이 아니라는 점을 알려줬고, array와 value값이 같은 값을 가져야 한다는 것도 알 수 있음
- 들어온 값이 숫자 배열과 숫자인 것을 확인하고, 논리적으로 리턴 값이 숫자 배열이라는 것을 파악

```typeScript
function insertAtBeginning<T>(array: T[], value: T) {
  const newArray = [value, ...array];
  return newArray;
}

const demoArray = [1, 2, 3];
const updatedArray = insertAtBeginning(demoArray, -1); // number[]
```

## 모델

### class를 이용

```typeScript
class Todo {
  id: string
  text: string

  constructor(todoText: string) {
    this.id = new Date().toISOString()
    this.text = todoText
  }
}

export default Todo
```

### interface를 이용

```typeScript
interface Todo {
    id: string;
    text: string;
  }

  // 객체를 생성하는 함수
  const createTodo = (todoText: string): Todo => ({
    id: new Date().toISOString(),
    text: todoText,
  });

  export { Todo, createTodo };
```

### type을 이용

```typeScript
type Todo = {
    id: string;
    text: string;
  };

  // 객체를 생성하는 함수
  const createTodo = (todoText: string): Todo => ({
    id: new Date().toISOString(),
    text: todoText,
  });

  export { Todo, createTodo };
```

1. 객체 생성 방식
   - class를 사용하면 new Todo("할 일") 형태로 객체를 생성할 수 있음.
   - interface나 type을 사용하면 createTodo("할 일") 같은 별도의 팩토리 함수를 만들어야 함.
2. 인스턴스 메서드
   - class는 메서드를 포함할 수 있어 Todo 내부에 printTodo() 같은 메서드를 추가할 수 있음.
   - interface나 type은 순수한 데이터 구조이므로 메서드를 포함할 수 없고, 따로 유틸 함수를 만들어야 함.
3. 확장성
   - interface는 다른 interface를 extends로 확장할 수 있음.
   - type은 & 연산자로 확장 가능하지만 extends처럼 계층적으로 설계하는 데는 interface가 더 적합함.
   - class는 상속(extends)과 함께 생성자와 메서드를 활용한 객체 지향적인 접근이 가능함.
4. 런타임 영향
   - class는 자바스크립트에서 실제 함수로 변환되므로 런타임에도 존재하지만,
     interface와 type은 컴파일 타임에만 존재하고 런타임에서는 사라짐. - 따라서 interface나 type을 사용하면 더 가벼운 코드가 됨.

### 결론

단순한 데이터 구조라면 interface나 type이 더 적합함.
객체 지향적인 설계가 필요하다면 class를 사용하는 것이 좋음.

## props

```typeScript
// app.tsx
import "./App.css"

import { useState } from "react"

import NewTodo from "./components/NewTodo.tsx"
import Todos from "./components/Todos.jsx"

import Todo from "./models/todos.ts"

function App() {
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

  return (
    <div>
      <NewTodo onAddTodo={addTodoHandler} />
      <Todos items={todos} onRemoveTodo={removeTodoHandler} />
    </div>
  )
}

export default App
```

```typeScript
// NewTodo.tsx
import classes from "./NewTodo.module.css"

import React from "react"
import { useRef } from "react"

const NewTodo: React.FC<{ onAddTodo: (text: string) => void }> = (props) => {
  const textInputRef = useRef<HTMLInputElement>(null)

  function submitHandler(event: React.FormEvent) {
    event.preventDefault()

    // ?. 값에 접근해 보고, 가능하다면 입력된 값을 가져와 enteredText에 할당하고, 불가능하다면 null을 할당 -> (string | undefined) 타입.
    // !. 값에 접근해 보고, 가능하다면 입력된 값을 가져와 enteredText에 할당하고, 불가능하다면 오류를 발생시킵니다. -> string 타입.
    const enteredText = textInputRef.current!.value

    if (enteredText.trim().length === 0) {
      return alert("Please enter a valid text.")
    }

    props.onAddTodo(enteredText)
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
```

```typeScript
// Todos.tsx
import classes from "./Todos.module.css"

import React from "react"

import TodoItem from "./TodoItem"
import Todo from "../models/todos"

const Todos: React.FC<{ items: Todo[]; onRemoveTodo: (id: string) => void }> = (
  props
) => {
  return (
    <ul className={classes.todos}>
      {props.items.map((item) => {
        return (
          <TodoItem
            key={item.id}
            text={item.text}
            // bind() 메서드는 실행할 함수를 미리 설정할 수 있음
            // 먼저 이 키워드가 호출될 함수 안에서 무엇을 가리키는지 지정하고 (null)
            // 그 다음에는 함수에 전달할 인수를 지정 (item.id)
            onRemoveTodo={props.onRemoveTodo.bind(null, item.id)}
          />
        )
      })}
    </ul>
  )
}

export default Todos
```

```typeScript
// TodoItem.tsx
import classes from "./TodoItem.module.css"

import React from "react"

const TodoItem: React.FC<{
  text: string
  onRemoveTodo: (event: React.MouseEvent) => void
}> = (props) => {
  return (
    <li className={classes.item} onClick={props.onRemoveTodo}>
      {props.text}
    </li>
  )
}

export default TodoItem
```

## context api
```typeScript
// App.tsx
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
```

```typeScript
// todos-context.tsx
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
```

```typeScript
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
```

```typeScript
// Todos.tsx
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
```

```typeScript
import classes from "./TodoItem.module.css"

import React from "react"

const TodoItem: React.FC<{
  text: string
  onRemoveTodo: (event: React.MouseEvent) => void
}> = (props) => {
  return (
    <li className={classes.item} onClick={props.onRemoveTodo}>
      {props.text}
    </li>
  )
}

export default TodoItem
```

