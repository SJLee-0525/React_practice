import CartContextProvider from "./store/shopping-cart-context.jsx"
import Header from "./components/Header.jsx"
import Shop from "./components/Shop.jsx"
import Product from "./components/Product.jsx"

function App() {
  return (
    <CartContextProvider>
      <Header />
      <Shop />
    </CartContextProvider>
  )
}

export default App
