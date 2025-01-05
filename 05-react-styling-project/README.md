# 5 React Styling

## Vanilla CSS

### 장점

- 익숙한 vanillan SS
- jsx 파일을 작성하는 동안 방해받지 않고 다른 사람이 css 파일 수정이 가능함
- class 속성을 이용해 동적으로 css 적용이 가능함

  `<label className={`label ${emailNotValid ? "invalid" : undefined}`}>Email</label>`

### 단점

- css 규칙이 컴포넌트에 scope 되지 않음
  - 물론 자손, 자식 결합자 등을 사용해서 이를 일부 해결할 수는 있음

## Inline Style로 CSS 적용하기

`<p style={{color: 'red', textAlign: 'left'}}>ABCDE</p>`

### 장점

- 쉽게 추가 가능
- 추가하는 요소에만 영향을 끼침
- 스타일을 동적 및 조건적으로 적용할 수 있음

  `<input style={{ backgroundColor: emailNotValid ? "#fed2d2" : "#d1d5db" }} />`

### 단점

- 모든 요소를 개별적으로 스타일링 해야 함
- css와 jsx 코드의 구분이 없어짐
- 코드가 복잡해짐

## CSS 모듈로 CSS 규칙 스코핑 하기

1. 파일 이름 변경 `Header.css -> Header.module.css`
2. import 과정 추가 및 스타일 적용

```jsx
import classs from "./Header.module.css"

export default function Header() {
  return (
    <header>
      <p className={1 === 1 ? classes.paragraph : undefined}>A community of artists and art-lovers.</p>
    </header>
  )
}
```

### 장점

- css 모듈의 장점을 그대로 가져옴
- 해당 css 파일을 가져온 컴포넌트 파일로 스코프됨

### 단점

- 여전히 vanilla css를 사용해야 함
- 프로젝트 규모가 커지면 방대한 양의 css파일이 생성될 수 있음

## Styled Components

1.  `npm install styled-components`
2.  `import { styled } from "styled-components"`

### 기본적인 사용법

```jsx
import { useState } from "react"
import { styled } from "styled-components"

const ControlContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`
const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #6b7280;
`

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  line-height: 1.5;
  background-color: #d1d5db;
  color: #374151;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`

const InputParagraph = styled.p``

export default function AuthInputs() {
  const [enteredEmail, setEnteredEmail] = useState("")
  const [enteredPassword, setEnteredPassword] = useState("")
  const [submitted, setSubmitted] = useState(false)

  function handleInputChange(identifier, value) {
    if (identifier === "email") {
      setEnteredEmail(value)
    } else {
      setEnteredPassword(value)
    }
  }

  function handleLogin() {
    setSubmitted(true)
  }

  const emailNotValid = submitted && !enteredEmail.includes("@")

  return (
    <div id="auth-inputs">
      <ControlContainer>
        <p>
          <Label className={`label ${emailNotValid ? "invalid" : undefined}`}>Email</Label>
          <Input type="email" className={emailNotValid ? "invalid" : undefined} onChange={(event) => handleInputChange("email", event.target.value)} />
        </p>
      </ControlContainer>
      <div className="actions">
        <button type="button" className="text-button">
          Create a new account
        </button>
        <button className="button" onClick={handleLogin}>
          Sign In
        </button>
      </div>
    </div>
  )
}
```

### Styled Component로 동적 및 조건적으로 스타일링

```jsx
import { useState } from "react"
import { styled } from "styled-components"

const ControlContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`
const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ $invalid }) => ($invalid ? "#f87171" : "#6b7280")};
`

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  line-height: 1.5;
  background-color: ${({ $invalid }) => ($invalid ? "#fed2d2" : "#d1d5db")};
  color: ${({ $invalid }) => ($invalid ? "#ef4444" : "#374151")};
  border: 1px solid ${({ $invalid }) => ($invalid ? "#f73f3f" : "transparent")};
  border-radius: 0.25rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`

const InputParagraph = styled.p``

export default function AuthInputs() {
  const [enteredEmail, setEnteredEmail] = useState("")
  const [enteredPassword, setEnteredPassword] = useState("")
  const [submitted, setSubmitted] = useState(false)

  function handleInputChange(identifier, value) {
    if (identifier === "email") {
      setEnteredEmail(value)
    } else {
      setEnteredPassword(value)
    }
  }

  function handleLogin() {
    setSubmitted(true)
  }

  const emailNotValid = submitted && !enteredEmail.includes("@")

  return (
    <div id="auth-inputs">
      <ControlContainer>
        <p>
          <Label $invalid={emailNotValid}>Email</Label>
          <Input type="email" $invalid={emailNotValid} onChange={(event) => handleInputChange("email", event.target.value)} />
        </p>
      </ControlContainer>
      <div className="actions">
        <button type="button" className="text-button">
          Create a new account
        </button>
        <button className="button" onClick={handleLogin}>
          Sign In
        </button>
      </div>
    </div>
  )
}
```

### Styled Component의 가상 선택자, 중첩 규칙, 미디어 쿼리

#### `&`를 활용하면 하나의 래핑 부모 요소만 변환해도 자식 요소들에 style를 적용시킬 수 있음

```jsx
import { styled } from "styled-components"

import logo from "../../assets/logo.png"

const StyledHeader = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 2rem;

  & img {
    object-fit: contain;
    margin-bottom: 2rem;
    width: 11rem;
    height: 11rem;
  }

  & h1 {
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: 0.4em;
    text-align: center;
    text-transform: uppercase;
    color: #9a3412;
    font-family: "Pacifico", cursive;
    margin: 0;
  }

  & p {
    text-align: center;
    color: #a39191;
    margin: 0;
  }

  @media (min-width: 768px) {
    margin-bottom: 4rem;

    & h1 {
      font-size: 2.25rem;
    }
  }
`

export default function Header() {
  return (
    <StyledHeader>
      <img src={logo} alt="A canvas" />
      <h1>ReactArt</h1>
      <p>A community of artists and art-lovers.</p>
    </StyledHeader>
  )
}
```

#### hover와 같은 가상 선택자도 비슷하게 사용

```jsx
import { useState } from "react"
import { styled } from "styled-components"

const ControlContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`
const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ $invalid }) => ($invalid ? "#f87171" : "#6b7280")};
`

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  line-height: 1.5;
  background-color: ${({ $invalid }) => ($invalid ? "#fed2d2" : "#d1d5db")};
  color: ${({ $invalid }) => ($invalid ? "#ef4444" : "#374151")};
  border: 1px solid ${({ $invalid }) => ($invalid ? "#f73f3f" : "transparent")};
  border-radius: 0.25rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`

const Button = styled.button`
  padding: 1rem 2rem;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 0.25rem;
  color: #1f2937;
  background-color: #f0b322;
  border-radius: 6px;
  border: none;

  &:hover {
    background-color: #f0920e;
  }
`

export default function AuthInputs() {
  const [enteredEmail, setEnteredEmail] = useState("")
  const [enteredPassword, setEnteredPassword] = useState("")
  const [submitted, setSubmitted] = useState(false)

  function handleInputChange(identifier, value) {
    if (identifier === "email") {
      setEnteredEmail(value)
    } else {
      setEnteredPassword(value)
    }
  }

  function handleLogin() {
    setSubmitted(true)
  }

  const emailNotValid = submitted && !enteredEmail.includes("@")
  const passwordNotValid = submitted && enteredPassword.trim().length < 6

  return (
    <div id="auth-inputs">
      <ControlContainer>
        <p>
          <Label $invalid={emailNotValid}>Email</Label>
          <Input type="email" $invalid={emailNotValid} onChange={(event) => handleInputChange("email", event.target.value)} />
        </p>
        <p>
          <Label $invalid={passwordNotValid}>Password</Label>
          <Input type="password" $invalid={passwordNotValid} onChange={(event) => handleInputChange("password", event.target.value)} />
        </p>
      </ControlContainer>
      <div className="actions">
        <button type="button" className="text-button">
          Create a new account
        </button>
        <Button className="button" onClick={handleLogin}>
          Sign In
        </Button>
      </div>
    </div>
  )
}
```

### 재사용 가능한 컴포넌트 만들기

```jsx
// Input.jsx

import { styled } from "styled-components"

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ $invalid }) => ($invalid ? "#f87171" : "#6b7280")};
`

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  line-height: 1.5;
  background-color: ${({ $invalid }) => ($invalid ? "#fed2d2" : "#d1d5db")};
  color: ${({ $invalid }) => ($invalid ? "#ef4444" : "#374151")};
  border: 1px solid ${({ $invalid }) => ($invalid ? "#f73f3f" : "transparent")};
  border-radius: 0.25rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`

export default function CustomInput({ label, invalid, ...props }) {
  return (
    <p>
      <Label $invalid={invalid}>{label}</Label>
      <Input $invalid={invalid} {...props} />
    </p>
  )
}
```

```jsx
// Button.jsx

import { styled } from "styled-components"

const Button = styled.button`
  padding: 1rem 2rem;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 0.25rem;
  color: #1f2937;
  background-color: #f0b322;
  border-radius: 6px;
  border: none;

  &:hover {
    background-color: #f0920e;
  }
`
export default Button
```

```jsx
// AuthInputs.jsx

import { useState } from "react"
import { styled } from "styled-components"

import Input from "../Input.jsx"
import Button from "../Button.jsx"

// 1회성으로 사용될 가능성이 크기에 그냥 같은 파일에 둬도 무방
const ControlContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`

export default function AuthInputs() {
  const [enteredEmail, setEnteredEmail] = useState("")
  const [enteredPassword, setEnteredPassword] = useState("")
  const [submitted, setSubmitted] = useState(false)

  function handleInputChange(identifier, value) {
    if (identifier === "email") {
      setEnteredEmail(value)
    } else {
      setEnteredPassword(value)
    }
  }

  function handleLogin() {
    setSubmitted(true)
  }

  const emailNotValid = submitted && !enteredEmail.includes("@")
  const passwordNotValid = submitted && enteredPassword.trim().length < 6

  return (
    <div id="auth-inputs">
      <ControlContainer>
        <Input type="email" label="EMAIL" invalid={emailNotValid} onChange={(event) => handleInputChange("email", event.target.value)} />
        <Input type="password" label="PASSWORD" invalid={passwordNotValid} onChange={(event) => handleInputChange("password", event.target.value)} />
      </ControlContainer>
      <div className="actions">
        <button type="button" className="text-button">
          Create a new account
        </button>
        <Button className="button" onClick={handleLogin}>
          Sign In
        </Button>
      </div>
    </div>
  )
}
```

## Tailwindcss

https://tailwindcss.com/docs/guides/vite

```
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

```javascript
// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

```css
/* index.css */

@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 반응형 디자인

```jsx
export default function Header() {
  return (
    <header className="flex flex-col items-center mt-8 mb-8 md:mb-16">
      <img src={logo} alt="A canvas" className="object-contain mb-8 w-44 h-44" />
      <h1 className="text-xl md:text-4xl font-semibold tracking-widest text-center uppercase text-amber-800 font-title">ReactArt</h1>
      <p className="text-stone-500">A community of artists and art-lovers.</p>
    </header>
  )
}
```

### 가상 액션

```jsx
export default function Button({ children, ...props }) {
  return (
    <button className="px-4 py-2 font-semibold uppercase rounded text-stone-900 bg-amber-400 hover:bg-amber-500" {...props}>
      {children}
    </button>
  )
}
```

### Tailwindcss class 재사용

```jsx
export default function CustomInput({ label, invalid, ...props }) {
  let labelClasses = "block mb-2 text-xs font-bold tracking-wide uppercase "
  let inputClasses = "w-full px-3 py-2 leading-tight border rounded shadow "

  if (invalid) {
    labelClasses += "text-red-400"
    inputClasses += "text-red-500 bg-red-100 border-red-300"
  } else {
    labelClasses += "text-stone-200"
    inputClasses += "bg-stone-300 text-gray-700 "
  }

  return (
    <p>
      <label className={labelClasses} $invalid={invalid}>
        {label}
      </label>
      <input className={inputClasses} $invalid={invalid} {...props} />
    </p>
  )
}
```
