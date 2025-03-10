import { useContext } from "react"

import CartContext from "../../store/CartContext.jsx"
import UserProgressContext from "../../store/UserProgerssContext.jsx"

import { currencyFormatter } from "../../util/formatting"

import CartItem from "./CartItem.jsx"

import Modal from "../UI/Modal.jsx"
import Button from "../UI/Button.jsx"

export default function Cart() {
  const cartCtx = useContext(CartContext)
  const userProgressCtx = useContext(UserProgressContext)

  const cartTotal = cartCtx.items.reduce((totalPrice, item) => {
    return totalPrice + item.price * item.quantity
  }, 0)

  function handleCloseCart() {
    userProgressCtx.hideCart()
  }

  function handleGoToCheckout() {
    userProgressCtx.showCheckout()
  }

  return (
    <Modal className="cart" open={userProgressCtx.progress === "cart"} onClose={userProgressCtx.progress === "cart" ? handleCloseCart : null}>
      {/* userprogress가 cart일때만 close 함수가 호출되어 결제창으로 넘어갈 수 있게끔  */}
      <h2>Your Cart</h2>
      <ul>
        {cartCtx.items.map((item) => (
          <CartItem
            key={item.id}
            {...item}
            onIncrease={() => {
              cartCtx.addItem(item)
            }}
            onDecrease={() => {
              cartCtx.removeItem(item.id)
            }}
          />
        ))}
      </ul>
      <p className="cart-total">{currencyFormatter.format(cartTotal)}</p>
      <p className="modal-actions">
        <Button textOnly onClick={handleCloseCart}>
          Close
        </Button>
        {cartCtx.items.length > 0 && <Button onClick={handleGoToCheckout}>Go to Checkout</Button>}
      </p>
    </Modal>
  )
}
