# 16

## Context

```js
import { createContext } from "react"

const CartContext = createContext({
  //...
})

export function CartContextProvider({ childern }) {
  //...

  return <CartContext.Provider>{childern}</CartContext.Provider>
}

export default CartContext
```

### createContext

- 자동 완성에 도움이 됨
- Context는 그 자체만으로는 상태 관리를 하지 않음
- 값을 바꾸거나 업데이트를 하지 않고 데이터를 컴포넌트에 펼치는 역할

### ContextProvider 컴포넌트

- 컴포넌트를 감싸는 형태로 데이터를 전송, 관리
- Context로 펼쳐진 데이터는 상태 유지 중으로 Provide를 통해서 데이터 변화를 제어
- createContext로 생성한 Context는 Provider 속성을 가진 객체가 됨
- Provider 속성은 반환값이 되어 이 Context가 필요한 컴포넌트르 감싸는 형태로 존재하게 됨

## .reduce()

`array.reduce((누적값, 현재 요소) => { ... }, 초기값)`

```js
cartCtx.items.reduce((totalNumberOfItems, item) => {
  return totalNumberOfItems + item.quantity
}, 0)
```

초기값: totalNumberOfItems = 0

첫 번째 아이템 { id: 1, name: "Apple", quantity: 2 }
0 + 2 = 2

두 번째 아이템 { id: 2, name: "Banana", quantity: 3 }
2 + 3 = 5

세 번째 아이템 { id: 3, name: "Cherry", quantity: 1 }
5 + 1 = 6

최종 결과 totalCartItems = 6 반환

## Modal

```jsx
import { useRef, useEffect } from "react"
import { createPortal } from "react-dom"

export default function Modal({ children, open, onClose, className = "" }) {
  const dialog = useRef()
  // useRef()를 사용해서 <dialog> 요소를 직접 참조.
  // dialog.current가 <dialog> DOM 요소를 가리킴.

  useEffect(() => {
    const modal = dialog.current

    if (open) {
      modal.showModal()
    }

    return () => modal.close()
  }, [open])
  // open prop이 true로 바뀌면 dialog.current.showModal()을 호출해서 모달을 열어줌.
  // useEffect는 open 값이 변경될 때마다 실행됨.
  // showModal()은 <dialog> 태그의 기본 내장 함수로, 모달을 화면에 띄우는 역할을 함.
  // dialog.current.close()를 호출하면 모달을 닫을 수 있음

  return createPortal(
    <dialog ref={dialog} className={`modal ${className}`} onClose={onClose}>
      {children}
    </dialog>,
    document.getElementById("modal")
  )
  // createPortal은 React 컴포넌트를 기존 DOM 트리 밖으로 렌더링하는 방법.
  // 여기서는 document.getElementById("modal") 내부에 <dialog> 요소를 추가함.
  // 이렇게 하면 모달이 다른 UI 구조와 독립적으로 렌더링되므로, 레이아웃에 영향 없이 자유롭게 스타일 조정 가능.
}
```

## HTTP 요청

### useHttp Hooks

```js
// useHttp.js

import { useState, useEffect, useCallback } from "react"

async function sendHttpRequest(url, config) {
  // fetch(url, config)를 사용해 HTTP 요청을 보냄.
  const response = await fetch(url, config)

  // response.json()을 호출해 응답 데이터를 JSON으로 변환.
  const resData = await response.json()

  if (!response.ok) {
    // response.ok가 false(오류 발생)면 throw new Error(...)로 예외를 발생.
    throw new Error(resData.message || "Something went wrong, failed to send request.")
  }

  return resData // 정상 응답이면 resData를 반환.
}

// url: 요청할 엔드포인트, config: HTTP 요청 설정 (method, headers, body 등), initialData: 초기 데이터 값
export default function useHttp(url, config, initialData) {
  const [data, setData] = useState(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()

  function clearData() {
    setData(initialData)
  }

  // 요청 실행: useCallback을 사용하여 URL과 설정이 바뀌지 않으면 함수가 재생성되지 않도록 최적화
  const sendRequest = useCallback(
    async function sendRequest(data) {
      setIsLoading(true)

      try {
        // sendHttpRequest(url, { ...config, body: data })를 호출해 서버 요청
        const resData = await sendHttpRequest(url, { ...config, body: data })

        // 성공 시 setData(resData)로 응답 데이터를 저장
        setData(resData)
      } catch (error) {
        // 실패 시 setError(error.message)로 에러 상태 업데이트
        setError(error.message || "Something went wrong!")
      }

      setIsLoading(false)
    },
    [url, config]
  )

  // useEffect를 이용해 컴포넌트가 처음 렌더링될 때 자동으로 GET 요청을 보냄.
  useEffect(() => {
    // config.method가 "GET"이거나 config 자체가 없으면 자동 실행됨
    if ((config && (config.method == "GET" || !config.method)) || !config) {
      sendRequest()
    }
  }, [sendRequest, config]) // sendRequest와 config가 변경될 때 다시 실행됨.

  return {
    data,
    isLoading,
    error,
    sendRequest,
    clearData,
  }
}
```

### GET 요청

- fetch(url, {})에서 method를 지정하지 않으면 기본적으로 GET 요청이 됨.
- useHttp 내부의 useEffect에서 config.method가 없거나 "GET"이면 자동으로 sendRequest() 실행됨.

#### -> requestConfig = {} (빈 객체)를 전달하면 GET 요청이 실행됨!

- 아래 두 코드는 같다.  
  `fetch("http://localhost:3000/meals", {})`
  `fetch("http://localhost:3000/meals", { method: "GET" })`

```jsx
// Meals.jsx

import useHttp from "../../hooks/useHttp.js"

import Error from "../UI/Error.jsx"
import MealItem from "./MealItem.jsx"

const requestConfig = {}
// useHttp의 두번째 인자로 전송할 config 데이터에 기본적으로 빈 객체 {}를 사용.
// 컴포넌트 외부에서 객체를 한 번만 생성하게끔 해서, 의존성에 의한 무한루프를 해결

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
```

### POST 요청

```jsx
// Checkout.jsx

import { useContext } from "react"

import { currencyFormatter } from "../../util/formatting"

import Modal from "../UI/Modal.jsx"
import Input from "../UI/Input.jsx"
import Button from "../UI/Button.jsx"
import Error from "../UI/Error.jsx"

import CartContext from "../../store/CartContext.jsx"
import UserProgressContext from "../../store/UserProgerssContext.jsx"

import useHttp from "../../hooks/useHttp.js"

// HTTP 요청 설정 (requestConfig)
// headers: { "Content-Type": "application/json" } → JSON 형식으로 데이터 전송할 것임을 명시
const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
}

export default function Checkout() {
  const cartCtx = useContext(CartContext)
  const userProgressCtx = useContext(UserProgressContext)

  // useHttp 훅 사용 (requestConfig를 이용해 POST 요청 수행)
  const { data, isLoading: isSending, error, sendRequest, clearData } = useHttp("http://localhost:3000/orders", requestConfig)

  const cartTotal = cartCtx.items.reduce((totalPrice, item) => {
    return totalPrice + item.price * item.quantity
  }, 0)

  function handleClose() {
    userProgressCtx.hideCheckout()
  }

  function handleFinish() {
    userProgressCtx.hideCheckout()
    cartCtx.clearCart()
    clearData()
  }

  // 주문 폼 제출
  function handleSubmit(event) {
    event.preventDefault() // 폼 기본 제출 동작 방지 (페이지 새로고침 X)

    const fd = new FormData(event.target) // 폼 데이터를 가져와 FormData 객체로 변환
    const customerData = Object.fromEntries(fd.entries()) // 폼 데이터를 { name: value } 형식의 객체로 변환

    // SendRequest()를 실행하여 주문 데이터를 POST 요청으로 서버에 전송
    sendRequest(
      JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData,
        },
      })
    )
  }

  let actions = (
    <>
      <Button type="button" textOnly onClick={handleClose}>
        Close
      </Button>
      <Button>Submit Order</Button>
    </>
  )

  if (isSending) {
    actions = <span>Sending order data...</span>
  }

  if (data && !error) {
    return (
      <Modal open={userProgressCtx.progress === "checkout"} onClose={handleClose}>
        <h2>Success!</h2>
        <p>Your order was submitted succesfully.</p>
        <p>We will get vack to you with more details via email within the next few minutes.</p>
        <p className="modal-actions">
          <Button onClick={handleFinish}>OK</Button>
        </p>
      </Modal>
    )
  }

  return (
    <Modal open={userProgressCtx.progress === "checkout"} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>
        <Input label="Full Name" type="text" id="name" />
        <Input label="E-Mail Address" type="email" id="email" />
        <Input label="Street" type="text" id="street" />
        <div className="control-row">
          <Input label="Postal Code" type="text" id="postal-code" />
          <Input label="City" type="text" id="city" />
        </div>
        {error && <Error title="Failed to submit order" message={error} />}
        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  )
}
```
