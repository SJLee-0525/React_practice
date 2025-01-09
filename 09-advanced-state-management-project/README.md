# 9

## Prop Drilling

### 기존처럼 App 컴포넌트에서 상태를 관리하는 것은 여러 문제를 야기할 수 있음

- 데이터를 넘겨주고 싶은 컴포넌트에 전달하기 위해 해당 데이터가 필요 없는 여러 컴포넌트를 거쳐야만 함
- 이럴 경우 해당 컴포넌트의 재사용이 힘들어질 수 있음
- 추가적인 상용구 코드 또한 매우 많이 써야함

### 해결 방안

1. Component Composition: 컴포넌트 합성

- 컴포넌트 자체의 구조를 바꾸는 방법
- 모든 컴포넌트 층에 사용하기는 어려움ㅁ
- 모든 컴포넌트가 App 컴포넌트에 들어가고, 나머지 컴포넌트는 감싸는 용도로만 사용되는 문제도.

### 적용 전

```jsx
// App.jsx

<>
  <Header cart={shoppingCart} onUpdateCartItemQuantity={handleUpdateCartItemQuantity} />
  <Shop onAddItemToCart={handleAddItemToCart} />
</>
```

```jsx
// Shop.jsx

import { DUMMY_PRODUCTS } from "../dummy-products.js"
import Product from "./Product.jsx"

export default function Shop({ onAddItemToCart }) {
  return (
    <section id="shop">
      <h2>Elegant Clothing For Everyone</h2>

      <ul id="products">
        {DUMMY_PRODUCTS.map((product) => (
          <li key={product.id}>
            <Product {...product} onAddToCart={onAddItemToCart} />
          </li>
        ))}
      </ul>
    </section>
  )
}
```

### 적용 후

```jsx
<>
  <Header cart={shoppingCart} onUpdateCartItemQuantity={handleUpdateCartItemQuantity} />
  <Shop onAddItemToCart={handleAddItemToCart}>
    {DUMMY_PRODUCTS.map((product) => (
      <li key={product.id}>
        <Product {...product} onAddToCart={handleAddItemToCart} />
      </li>
    ))}
  </Shop>
</>
```

```jsx
import Product from "./Product.jsx"

export default function Shop({ children }) {
  return (
    <section id="shop">
      <h2>Elegant Clothing For Everyone</h2>
      <ul id="products">{children}</ul>
    </section>
  )
}
```

2. React's Context API

- 리액트의 컴포넌트와 컴포넌트 간의 데이터 공유를 용이하게 해 줌
- Context 값을 생성, 제공, 묶어주면서 다수 혹은 App의 컴포넌트를 묶어줌
- state(상태)와의 연결이 쉬움
- React State를 해당 컨텍스트 값에 연결하면, 앱 전체에 제공되는 방식으로 작동

### 기본 사용법

```jsx
// shopping-cart-context.jsx

import { createContext } from "react"

// 실질적으로 사용하지는 못하지만, 자동완성에 도움이 되는 부분임
export const CartContext = createContext({
  items: [],
})
```

```jsx
// App.jsx
import { CartContext } from "./store/shopping-cart-context.jsx"

return (
  <CartContext.Provider>
    <Header cart={shoppingCart} onUpdateCartItemQuantity={handleUpdateCartItemQuantity} />
    <Shop onAddItemToCart={handleAddItemToCart}>
      {DUMMY_PRODUCTS.map((product) => (
        <li key={product.id}>
          <Product {...product} onAddToCart={handleAddItemToCart} />
        </li>
      ))}
    </Shop>
  </CartContext.Provider>
)
```

### Context 소비하기

```jsx
// App.jsx
import { CartContext } from "./store/shopping-cart-context.jsx"

return (
  <CartContext.Provider value={{ items: [] }}>
    <Header cart={shoppingCart} onUpdateCartItemQuantity={handleUpdateCartItemQuantity} />
    <Shop onAddItemToCart={handleAddItemToCart}>
      {DUMMY_PRODUCTS.map((product) => (
        <li key={product.id}>
          <Product {...product} onAddToCart={handleAddItemToCart} />
        </li>
      ))}
    </Shop>
  </CartContext.Provider>
)
```

```jsx
// Cart.jsx

import { useContext } from "react"

import { CartContext } from "../store/shopping-cart-context"

export default function Cart({ onUpdateItemQuantity }) {
  const cartCtx = useContext(CartContext)
  // const { items } = useContext(CartContext)

  const totalPrice = cartCtx.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const formattedTotalPrice = `$${totalPrice.toFixed(2)}`

  return (
    <div id="cart">
      {cartCtx.items.length === 0 && <p>No items in cart!</p>}
      {cartCtx.items.length > 0 && (
        <ul id="cart-items">
          {cartCtx.items.map((item) => {
            const formattedPrice = `$${item.price.toFixed(2)}`

            return (
              <li key={item.id}>
                <div>
                  <span>{item.name}</span>
                  <span> ({formattedPrice})</span>
                </div>
                <div className="cart-item-actions">
                  <button onClick={() => onUpdateItemQuantity(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => onUpdateItemQuantity(item.id, 1)}>+</button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
      <p id="cart-total-price">
        Cart Total: <strong>{formattedTotalPrice}</strong>
      </p>
    </div>
  )
}
```

### Context와 상태(State) 연결하기

```jsx
// shopping-cart-context.jsx

import { createContext } from "react"

export const CartContext = createContext({
  items: [],
  addItemToCart: () => {},
})
```

```jsx
// App.jsx

import { useState } from "react"

import Header from "./components/Header.jsx"
import Shop from "./components/Shop.jsx"
import Product from "./components/Product.jsx"
import { DUMMY_PRODUCTS } from "./dummy-products.js"
import { CartContext } from "./store/shopping-cart-context.jsx"

function App() {
  const [shoppingCart, setShoppingCart] = useState({
    items: [],
  })

  function handleAddItemToCart(id) {
    setShoppingCart((prevShoppingCart) => {
      const updatedItems = [...prevShoppingCart.items]

      const existingCartItemIndex = updatedItems.findIndex((cartItem) => cartItem.id === id)
      const existingCartItem = updatedItems[existingCartItemIndex]

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        }
        updatedItems[existingCartItemIndex] = updatedItem
      } else {
        const product = DUMMY_PRODUCTS.find((product) => product.id === id)
        updatedItems.push({
          id: id,
          name: product.title,
          price: product.price,
          quantity: 1,
        })
      }

      return {
        items: updatedItems,
      }
    })
  }

  const ctxValue = {
    items: shoppingCart.items,
    addItemToCart: handleAddItemToCart,
  }

  return (
    <CartContext.Provider value={ctxValue}>
      <Header cart={shoppingCart} onUpdateCartItemQuantity={handleUpdateCartItemQuantity} />
      <Shop onAddItemToCart={handleAddItemToCart}>
        {DUMMY_PRODUCTS.map((product) => (
          <li key={product.id}>
            <Product {...product} onAddToCart={handleAddItemToCart} />
          </li>
        ))}
      </Shop>
    </CartContext.Provider>
  )
}

export default App
```

```jsx
// Product.jsx

import { useContext } from "react"

import { CartContext } from "../store/shopping-cart-context"

export default function Product({ id, image, title, price, description }) {
  const { addItemToCart } = useContext(CartContext)

  return (
    <article className="product">
      <img src={image} alt={title} />
      <div className="product-content">
        <div>
          <h3>{title}</h3>
          <p className="product-price">${price}</p>
          <p>{description}</p>
        </div>
        <p className="product-actions">
          <button onClick={() => addItemToCart(id)}>Add to Cart</button>
        </p>
      </div>
    </article>
  )
}
```

### Context Component에서 상태 제공하기

- 위와 같이 진행해도, 여전히 App 컴포넌트는 매우 무거움.
- 하나의 App 안에 여러개의 context가 존재할 가능성도.
- 모든 Context 관련 데이터 관리를 App이 아닌, 별개의 Context Component에서 관리하면 해결 가능

```jsx
// shopping-cart-context.jsx

import { createContext, useState } from "react"

import { DUMMY_PRODUCTS } from "../dummy-products.js"

export const CartContext = createContext({
  items: [],
  addItemToCart: () => {},
  updateItemQuantity: () => {},
})

export default function CartContextProvider({ children }) {
  const [shoppingCart, setShoppingCart] = useState({
    items: [],
  })

  function handleAddItemToCart(id) {
    setShoppingCart((prevShoppingCart) => {
      const updatedItems = [...prevShoppingCart.items]

      const existingCartItemIndex = updatedItems.findIndex((cartItem) => cartItem.id === id)
      const existingCartItem = updatedItems[existingCartItemIndex]

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        }
        updatedItems[existingCartItemIndex] = updatedItem
      } else {
        const product = DUMMY_PRODUCTS.find((product) => product.id === id)
        updatedItems.push({
          id: id,
          name: product.title,
          price: product.price,
          quantity: 1,
        })
      }

      return {
        items: updatedItems,
      }
    })
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    setShoppingCart((prevShoppingCart) => {
      const updatedItems = [...prevShoppingCart.items]
      const updatedItemIndex = updatedItems.findIndex((item) => item.id === productId)

      const updatedItem = {
        ...updatedItems[updatedItemIndex],
      }

      updatedItem.quantity += amount

      if (updatedItem.quantity <= 0) {
        updatedItems.splice(updatedItemIndex, 1)
      } else {
        updatedItems[updatedItemIndex] = updatedItem
      }

      return {
        items: updatedItems,
      }
    })
  }

  const ctxValue = {
    items: shoppingCart.items,
    addItemToCart: handleAddItemToCart,
    updateItemQuantity: handleUpdateCartItemQuantity,
  }

  return <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
}
```

```jsx
// App.jsx
import CartContextProvider from "./store/shopping-cart-context.jsx"
import Header from "./components/Header.jsx"
import Shop from "./components/Shop.jsx"
import Product from "./components/Product.jsx"

import { DUMMY_PRODUCTS } from "./dummy-products.js"

function App() {
  return (
    <CartContextProvider>
      <Header />
      <Shop>
        {DUMMY_PRODUCTS.map((product) => (
          <li key={product.id}>
            <Product {...product} />
          </li>
        ))}
      </Shop>
    </CartContextProvider>
  )
}

export default App
```

## useReducer

- 상태 관리의 목적을 가지고, 하나 이상의 값을 단순하게 하나의 값으로 줄이는 것

### 사용 전

```jsx
// shopping-cart-context.jsx

import { createContext, useState } from "react"

import { DUMMY_PRODUCTS } from "../dummy-products.js"

export const CartContext = createContext({
  items: [],
  addItemToCart: () => {},
  updateItemQuantity: () => {},
})

export default function CartContextProvider({ children }) {
  const [shoppingCart, setShoppingCart] = useState({
    items: [],
  })

  function handleAddItemToCart(id) {
    setShoppingCart((prevShoppingCart) => {
      const updatedItems = [...prevShoppingCart.items]

      const existingCartItemIndex = updatedItems.findIndex((cartItem) => cartItem.id === id)
      const existingCartItem = updatedItems[existingCartItemIndex]

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        }
        updatedItems[existingCartItemIndex] = updatedItem
      } else {
        const product = DUMMY_PRODUCTS.find((product) => product.id === id)
        updatedItems.push({
          id: id,
          name: product.title,
          price: product.price,
          quantity: 1,
        })
      }

      return {
        items: updatedItems,
      }
    })
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    setShoppingCart((prevShoppingCart) => {
      const updatedItems = [...prevShoppingCart.items]
      const updatedItemIndex = updatedItems.findIndex((item) => item.id === productId)

      const updatedItem = {
        ...updatedItems[updatedItemIndex],
      }

      updatedItem.quantity += amount

      if (updatedItem.quantity <= 0) {
        updatedItems.splice(updatedItemIndex, 1)
      } else {
        updatedItems[updatedItemIndex] = updatedItem
      }

      return {
        items: updatedItems,
      }
    })
  }

  const ctxValue = {
    items: shoppingCartState.items,
    addItemToCart: handleAddItemToCart,
    updateItemQuantity: handleUpdateCartItemQuantity,
  }

  return <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
}
```

### 사용 후

```jsx
// shopping-cart-context.jsx

import { createContext, useReducer } from "react"

import { DUMMY_PRODUCTS } from "../dummy-products.js"

export const CartContext = createContext({
  items: [],
  addItemToCart: () => {},
  updateItemQuantity: () => {},
})

function shoppingCartReducer(state, action) {
  if (action.type === "ADD_ITEM") {
    const updatedItems = [...state.items]

    const existingCartItemIndex = updatedItems.findIndex((cartItem) => cartItem.id === action.payload)
    const existingCartItem = updatedItems[existingCartItemIndex]

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      }
      updatedItems[existingCartItemIndex] = updatedItem
    } else {
      const product = DUMMY_PRODUCTS.find((product) => product.id === action.payload)
      updatedItems.push({
        id: action.payload,
        name: product.title,
        price: product.price,
        quantity: 1,
      })
    }

    return {
      ...state,
      items: updatedItems,
    }
  } else if (action.type === "UPDATE_ITEM") {
    const updatedItems = [...state.items]
    const updatedItemIndex = updatedItems.findIndex((item) => item.id === action.payload.productId)

    const updatedItem = {
      ...updatedItems[updatedItemIndex],
    }

    updatedItem.quantity += action.payload.amount

    if (updatedItem.quantity <= 0) {
      updatedItems.splice(updatedItemIndex, 1)
    } else {
      updatedItems[updatedItemIndex] = updatedItem
    }

    return {
      ...state,
      items: updatedItems,
    }
  }
  return state
}

export default function CartContextProvider({ children }) {
  const [shoppingCartState, shoppingCartDispatch] = useReducer(shoppingCartReducer, { items: [] })
  // 첫번째 요소는 useReducer로 관리되는 상태, 두번째 요소는 dispatch 함수
  // dispatch 함수는 액션을 보낼 수 있는데, 액션은 추후 리듀서 기능에 의해 사용됨

  function handleAddItemToCart(id) {
    shoppingCartDispatch({
      type: "ADD_ITEM",
      payload: id,
    })
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    shoppingCartDispatch({
      type: "UPDATE_ITEM",
      payload: {
        productId,
        amount,
      },
    })
  }

  const ctxValue = {
    items: shoppingCartState.items,
    addItemToCart: handleAddItemToCart,
    updateItemQuantity: handleUpdateCartItemQuantity,
  }

  return <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
}
```

### 비교

```jsx
// shopping-cart-context.jsx

import { createContext, useState, useReducer } from "react"

import { DUMMY_PRODUCTS } from "../dummy-products.js"

export const CartContext = createContext({
  items: [],
  addItemToCart: () => {},
  updateItemQuantity: () => {},
})

function shoppingCartReducer(state, action) {
  if (action.type === "ADD_ITEM") {
    const updatedItems = [...state.items]

    const existingCartItemIndex = updatedItems.findIndex((cartItem) => cartItem.id === action.payload)
    const existingCartItem = updatedItems[existingCartItemIndex]

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      }
      updatedItems[existingCartItemIndex] = updatedItem
    } else {
      const product = DUMMY_PRODUCTS.find((product) => product.id === action.payload)
      updatedItems.push({
        id: action.payload,
        name: product.title,
        price: product.price,
        quantity: 1,
      })
    }

    return {
      ...state,
      items: updatedItems,
    }
  } else if (action.type === "UPDATE_ITEM") {
    const updatedItems = [...state.items]
    const updatedItemIndex = updatedItems.findIndex((item) => item.id === action.payload.productId)

    const updatedItem = {
      ...updatedItems[updatedItemIndex],
    }

    updatedItem.quantity += action.payload.amount

    if (updatedItem.quantity <= 0) {
      updatedItems.splice(updatedItemIndex, 1)
    } else {
      updatedItems[updatedItemIndex] = updatedItem
    }

    return {
      ...state,
      items: updatedItems,
    }
  }
  return state
}

export default function CartContextProvider({ children }) {
  const [shoppingCartState, shoppingCartDispatch] = useReducer(shoppingCartReducer, { items: [] })
  // 첫번째 요소는 useReducer로 관리되는 상태, 두번째 요소는 dispatch 함수
  // dispatch 함수는 액션을 보낼 수 있는데, 액션은 추후 리듀서 기능에 의해 사용됨

  //   const [shoppingCart, setShoppingCart] = useState({
  //     items: [],
  //   })

  function handleAddItemToCart(id) {
    shoppingCartDispatch({
      type: "ADD_ITEM",
      payload: id,
    })

    // setShoppingCart((prevShoppingCart) => {
    //   const updatedItems = [...prevShoppingCart.items]

    //   const existingCartItemIndex = updatedItems.findIndex((cartItem) => cartItem.id === id)
    //   const existingCartItem = updatedItems[existingCartItemIndex]

    //   if (existingCartItem) {
    //     const updatedItem = {
    //       ...existingCartItem,
    //       quantity: existingCartItem.quantity + 1,
    //     }
    //     updatedItems[existingCartItemIndex] = updatedItem
    //   } else {
    //     const product = DUMMY_PRODUCTS.find((product) => product.id === id)
    //     updatedItems.push({
    //       id: id,
    //       name: product.title,
    //       price: product.price,
    //       quantity: 1,
    //     })
    //   }

    //   return {
    //     items: updatedItems,
    //   }
    // })
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    shoppingCartDispatch({
      type: "UPDATE_ITEM",
      payload: {
        productId,
        amount,
      },
    })
    // setShoppingCart((prevShoppingCart) => {
    //   const updatedItems = [...prevShoppingCart.items]
    //   const updatedItemIndex = updatedItems.findIndex((item) => item.id === productId)

    //   const updatedItem = {
    //     ...updatedItems[updatedItemIndex],
    //   }

    //   updatedItem.quantity += amount

    //   if (updatedItem.quantity <= 0) {
    //     updatedItems.splice(updatedItemIndex, 1)
    //   } else {
    //     updatedItems[updatedItemIndex] = updatedItem
    //   }

    //   return {
    //     items: updatedItems,
    //   }
    // })
  }

  const ctxValue = {
    items: shoppingCartState.items,
    addItemToCart: handleAddItemToCart,
    updateItemQuantity: handleUpdateCartItemQuantity,
  }

  return <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
}
```
