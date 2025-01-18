import Header from "./components/header/Header.jsx"
import Meals from "./components/meals/Meals.jsx"
import Cart from "./components/cart/Cart.jsx"
import Checkout from "./components/checkout/Checkout.jsx"

import { CartContextProvider } from "./store/CartContext.jsx"
import { UserProgressContextProvider } from "./store/UserProgerssContext.jsx"

function App() {
  return (
    <>
      <UserProgressContextProvider>
        <CartContextProvider>
          <Header />
          <Meals />
          <Cart />
          <Checkout />
        </CartContextProvider>
      </UserProgressContextProvider>
    </>
  )
}

export default App
