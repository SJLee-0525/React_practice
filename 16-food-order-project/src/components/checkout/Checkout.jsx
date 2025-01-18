import { useContext } from "react"

import { currencyFormatter } from "../../util/formatting"

import Modal from "../UI/Modal.jsx"
import Input from "../UI/Input.jsx"
import Button from "../UI/Button.jsx"
import Error from "../UI/Error.jsx"

import CartContext from "../../store/CartContext.jsx"
import UserProgressContext from "../../store/UserProgerssContext.jsx"

import useHttp from "../../hooks/useHttp.js"

const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
}

export default function Checkout() {
  const cartCtx = useContext(CartContext)
  const userProgressCtx = useContext(UserProgressContext)

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

  function handleSubmit(event) {
    event.preventDefault()

    const fd = new FormData(event.target)
    const customerData = Object.fromEntries(fd.entries()) // { name: value }

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
