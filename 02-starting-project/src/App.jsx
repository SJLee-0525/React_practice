import { Fragment } from "react"

import Header from "./components/Header/Header.jsx"
import CoreConcepts from "./components/CoreConcepts/CoreConcepts.jsx"
import Examples from "./components/Examples/Examples.jsx"

function App() {
  console.log("APP COMPONENT EXECUTING")

  return (
    <Fragment>
      <Header />
      <main>
        <CoreConcepts />
        <Examples />
      </main>
    </Fragment>
  )
}

export default App
