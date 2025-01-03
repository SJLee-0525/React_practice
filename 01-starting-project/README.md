# 1

## Component 함수

- 리액트에서 컴포넌트를 정의할 때 사용하는 함수.
- JSX를 반환.
- JSX는 자바스크립트의 확장 문법으로, HTML과 유사한 문법을 사용하여 UI를 정의할 수 있음.
- 내부 HTML 태그와 혼동하지 않기 위해서, 반드시 대문자로 시작할 것.
  - 컴포넌트를 사용할 때는 태그 형태로 사용.
- export를 통해서 내보낼 수 있음.
  - export default를 사용하면 기본으로 내보낼 수 있음.

## Props

### 단일 Prop 객체 전달

```javascript
<CoreConcept title={CORE_CONCEPTS[0].title} description={CORE_CONCEPTS[0].description} image={CORE_CONCEPTS[0].image} />
```

```javascript
<CoreConcept {...CORE_CONCEPTS[0]} />
```

CoreConcept 컴포넌트에 하나의 concept Prop를 전달할 수 있음 (Prop 이름은 선택적):

```javascript
<CoreConcept concept={CORE_CONCEPTS[0]} />
```

- CoreConcept 컴포넌트에서는 그 하나의 Prop만 받게 됨

```javascript
export default function CoreConcept({ concept }) {
  // Use concept.title, concept.description etc.
  // Or destructure the concept object: const { title, description, image } = concept;
}
```

### 받은 Prop들을 단일 객체로 그룹화

여러 Prop을 컴포넌트에 전달한 다음, 컴포넌트 함수 내에서 자바스크립트의 "Rest Property" 문법을 사용하여 단일 객체로 그룹화할 수도 있음.

```html
<CoreConcept title="{CORE_CONCEPTS[0].title}" description="{CORE_CONCEPTS[0].description}" image="{CORE_CONCEPTS[0].image}" />
```

받은 prop들을 아래와 같이 단일 객체로 그룹화할 수 있음

```javascript
export default function CoreConcept({ ...concept }) {
  // ...concept groups multiple values into a single object
  // Use concept.title, concept.description etc.
  // Or destructure the concept object: const { title, description, image } = concept;
}
```

### 기본 Prop 값

가끔 선택적 Prop을 받을 수 있는 컴포넌트를 만들게 될 때가 있습니다. 예를 들어, ‘type’ Prop을 받을 수 있는 커스텀 Button 컴포넌트가 있습니다.

#### type 설정이 된 경우:

```html
<button type="submit" caption="My Button" />
```

#### 되지 않은 경우:

```html
<button caption="My Button" />
```

type Prop에 대한 기본 값을 설정해, 전달되지 않을 경우를 대비할 수 있음

```javascript
export default function Button({ caption, type = "submit" }) {
  // caption has no default value, type has a default value of "submit"
}
```

### Children Prop

```html
<TabButton>Component</TabButton>
```

이러한 경우 children Prop을 사용하여 컴포넌트 내부의 내용을 전달할 수 있음

```javascript
export default function TabButton(props) {
  console.log("TAB BUTTON COMPONENT RENDERED")

  return (
    <li>
      <button>{props.children}</button>
    </li>
  )
}

//////////////////////////////////////////////////

export default function TabButton({ children}) {
  console.log("TAB BUTTON COMPONENT RENDERED")

  return (
    <li>
      <button>{children}</button>
    </li>
  )
}
```

## 이벤트

- 이벤트 핸들러 함수를 전달할 수 있음
- 이벤트 핸들러 함수는 컴포넌트 내부에서 정의되어야 함

```html
<TabButton isSelected={selectedTopic === "components"} onSelect={() => handleClick("components")}>
    Component
</TabButton>
```

```javascript
export default function TabButton({ children, onSelect, isSelected }) {
  console.log("TAB BUTTON COMPONENT RENDERED")

  return (
    <li>
      <button className={isSelected ? "active" : undefined} onClick={onSelect}>
        {children}
      </button>
    </li>
  )
}
```

## useState Hook

- useState는 배열을 반환하며, 첫 번째 요소는 상태 값, 두 번째 요소는 상태 값을 업데이트하는 함수
- 컴포넌트가 실행될 때 초기 값이 selectedTopic에 할당됨.
- 다시 컴포넌트가 실행될 때는 업데이트 된 값이 할당
- 컴포넌트가 완전히 새로 렌더링되기 전까지는, 이전 상태 값이 유지됨

```javascript
import { useState } from "react"

function App() {
  const [selectedTopic, setSelectedTopic] = useState()

  function handleClick(selectedButton) {
    setSelectedTopic(selectedButton)
  }

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
        </section>
      </main>
    </div>
  )
}

export default App
```

## 조건적 렌더링

### 삼항 연산자

```javascript
{
  !selectedTopic ? (
    <p>Please select a topic.</p>
  ) : (
    <div id="tab-content">
      <h3>{data.EXAMPLES[selectedTopic].title}</h3>
      <p>{data.EXAMPLES[selectedTopic].description}</p>
      <pre>
        <code>{data.EXAMPLES[selectedTopic].code}</code>
      </pre>
    </div>
  )
}
```

### 논리 연산자

```javascript
{
  !selectedTopic && <p>Please select a topic.</p>
}
{
  selectedTopic && (
    <div id="tab-content">
      <h3>{data.EXAMPLES[selectedTopic].title}</h3>
      <p>{data.EXAMPLES[selectedTopic].description}</p>
      <pre>
        <code>{data.EXAMPLES[selectedTopic].code}</code>
      </pre>
    </div>
  )
}
```

### 변수 사용

```javascript
function App() {
  const [selectedTopic, setSelectedTopic] = useState()

  function handleClick(selectedButton) {
    setSelectedTopic(selectedButton)
    console.log(selectedTopic)
  }

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
      </section>
    </div>
  )
}

export default App
```

### 동적 출력 (반복)

- vanilla JS와 유사 (map 함수 사용)
- key prop을 사용하여 각 요소를 식별하고 렌더링 성능을 최적화할 수 있음

```javascript
<ul>
  {data.CORE_CONCEPTS.map((conceptItem) => (
    <CoreConcepts key={conceptItem.title} {...conceptItem} />
  ))}{" "}
  {/*
  <CoreConcepts title="{data.CORE_CONCEPTS[0].title}" description="{data.CORE_CONCEPTS[0].description}" image="{data.CORE_CONCEPTS[0].image}" />
  <CoreConcepts {...data.CORE_CONCEPTS[1]} />
  <CoreConcepts {...data.CORE_CONCEPTS[2]} />
  <CoreConcepts {...data.CORE_CONCEPTS[3]} />
  */}
</ul>
```
