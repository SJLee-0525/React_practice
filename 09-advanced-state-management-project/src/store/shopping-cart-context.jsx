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
