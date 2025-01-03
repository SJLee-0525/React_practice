import { useState } from "react"

import * as data from "./data.js"

import Header from "./components/Header/Header.jsx"
import CoreConcepts from "./components/CoreConcept/CoreConcept.jsx"
import TabButton from "./components/Examples/TabButton.jsx"

function App() {
  const [selectedTopic, setSelectedTopic] = useState()

  function handleClick(selectedButton) {
    setSelectedTopic(selectedButton)
    console.log(selectedTopic)
  }

  console.log("APP COMPONENT RENDERED")

  let tabContent = <p>Please select a topic.</p>

  if (selectedTopic) {
    tabContent = (
      <div id="tab-content">
        <h3>{data.EXAMPLES[selectedTopic].title}</h3>
        <p>{data.EXAMPLES[selectedTopic].description}</p>
        <pre>
          <code>{data.EXAMPLES[selectedTopic].code}</code>
        </pre>
      </div>
    )
  }

  return (
    <div>
      <Header />
      <main>
        <section id="core-concepts">
          <h2>Core Concepts</h2>
          <ul>
            {data.CORE_CONCEPTS.map((conceptItem) => (
              <CoreConcepts key={conceptItem.title} {...conceptItem} />
            ))}
            {/* <CoreConcepts title={data.CORE_CONCEPTS[0].title} description={data.CORE_CONCEPTS[0].description} image={data.CORE_CONCEPTS[0].image} />
            <CoreConcepts {...data.CORE_CONCEPTS[1]} />
            <CoreConcepts {...data.CORE_CONCEPTS[2]} />
            <CoreConcepts {...data.CORE_CONCEPTS[3]} /> */}
          </ul>
        </section>
        <section id="examples">
          <h2>Examples</h2>
          <menu>
            <TabButton isSelected={selectedTopic === "components"} onSelect={() => handleClick("components")}>
              Component
            </TabButton>
            <TabButton isSelected={selectedTopic === "jsx"} onSelect={() => handleClick("jsx")}>
              JSX
            </TabButton>
            <TabButton isSelected={selectedTopic === "props"} onSelect={() => handleClick("props")}>
              Props
            </TabButton>
            <TabButton isSelected={selectedTopic === "state"} onSelect={() => handleClick("state")}>
              State
            </TabButton>
          </menu>
          {tabContent}

          {/* {!selectedTopic ? (
            <p>Please select a topic.</p>
          ) : (
            <div id="tab-content">
              <h3>{data.EXAMPLES[selectedTopic].title}</h3>
              <p>{data.EXAMPLES[selectedTopic].description}</p>
              <pre>
                <code>{data.EXAMPLES[selectedTopic].code}</code>
              </pre>
            </div>
          )}{" "} */}
        </section>
      </main>
    </div>
  )
}

export default App
