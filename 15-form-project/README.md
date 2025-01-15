# 15

## Form

### 양식 제출 시 브라우저 새로고침을 방지하는 방법

```js
function handleSubmit(event) {
  event.preventDefault()
  console.log("submit")
}
```

## 사용자 입력 수집하기

### useState()

```jsx
import { useState } from "react"

export default function Login() {
  const [enteredValue, setEnteredValue] = useState({
    email: "",
    password: "",
  })

  function handleSubmit(event) {
    event.preventDefault()

    console.log(enteredValue)
  }

  function handleInputChange(identifier, event) {
    setEnteredValue((prevValue) => {
      return { ...prevValue, [identifier]: event.target.value }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <div className="control-row">
        <div className="control no-margin">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" onChange={(event) => handleInputChange("email", event)} value={enteredValue.email} />
        </div>

        <div className="control no-margin">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" onChange={(event) => handleInputChange("password", event)} value={enteredValue.password} />
        </div>
      </div>

      <p className="form-actions">
        <button className="button button-flat">Reset</button>
        <button className="button">Login</button>
      </p>
    </form>
  )
}
```

### useRef()

```jsx
import { useRef } from "react"

export default function Login() {
  const email = useRef("")
  const password = useRef("")

  function handleSubmit(event) {
    event.preventDefault()

    const enteredEmail = email.current.value
    const enteredPassword = password.current.value

    console.log(enteredEmail, enteredPassword)

    email.current.value = ""
    password.current.value = ""
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <div className="control-row">
        <div className="control no-margin">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" ref={email} />
        </div>

        <div className="control no-margin">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" ref={password} />
        </div>
      </div>

      <p className="form-actions">
        <button className="button button-flat">Reset</button>
        <button className="button">Login</button>
      </p>
    </form>
  )
}
```

### FormData()

- 브라우저에 내장된 constructor 함수
- 모든 input element에 name 속성이 작성돼 있어야 함 (key로 사용됨)
- `.get()`: 특정 key(name)에 대한 값 추출
- `.getAll()`: - 체크 박스와 같이 전부 같은 이름을 가진 하나의 입력창에서 여러 값을 얻고 싶을 때 사용
- FormData를 통해 불러낸 entries 객체를,브라우저의 Object 클래스에서 fromEntries 메서드에 보내 호출하면 입력된 모든 값들을 그룹화할 수 있음

```jsx
export default function Signup() {
  function handleSubmit(event) {
    event.preventDefault()

    const fd = new FormData(event.target)

    // 특정 key(name)에 대한 값 추출
    const enteredEmail = fd.get("email")
    console.log("enteredEmail: " + enteredEmail)

    // 다중 선택
    const acquisitionChannel = fd.getAll("acquisition")

    // 입력된 모든 값들을 그룹화
    const data = Object.fromEntries(fd.entries())
    data.acquisition = acquisitionChannel // entry가 담지 못하는 다중 값들 덮어 씌우기
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Welcome on board!</h2>
      <p>We just need a little bit of data from you to get you started 🚀</p>

      <div className="control">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" name="email" />
      </div>

      <div className="control-row">
        <div className="control">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" />
        </div>

        <div className="control">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input id="confirm-password" type="password" name="confirm-password" />
        </div>
      </div>

      <hr />

      <div className="control-row">
        <div className="control">
          <label htmlFor="first-name">First Name</label>
          <input type="text" id="first-name" name="first-name" />
        </div>

        <div className="control">
          <label htmlFor="last-name">Last Name</label>
          <input type="text" id="last-name" name="last-name" />
        </div>
      </div>

      <div className="control">
        <label htmlFor="phone">What best describes your role?</label>
        <select id="role" name="role">
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="employee">Employee</option>
          <option value="founder">Founder</option>
          <option value="other">Other</option>
        </select>
      </div>

      <fieldset>
        <legend>How did you find us?</legend>
        <div className="control">
          <input type="checkbox" id="google" name="acquisition" value="google" />
          <label htmlFor="google">Google</label>
        </div>

        <div className="control">
          <input type="checkbox" id="friend" name="acquisition" value="friend" />
          <label htmlFor="friend">Referred by friend</label>
        </div>

        <div className="control">
          <input type="checkbox" id="other" name="acquisition" value="other" />
          <label htmlFor="other">Other</label>
        </div>
      </fieldset>

      <div className="control">
        <label htmlFor="terms-and-conditions">
          <input type="checkbox" id="terms-and-conditions" name="terms" />I agree to the terms and conditions
        </label>
      </div>

      <p className="form-actions">
        <button type="reset" className="button button-flat">
          Reset
        </button>
        <button type="submit" className="button">
          Sign up
        </button>
      </p>
    </form>
  )
}
```

### Form 초기화

- Button의 reset type 활용하기

```html
<form onSubmit="{handleSubmit}">
  <h2>Welcome on board!</h2>
  <p>We just need a little bit of data from you to get you started 🚀</p>

  <div className="control">
    <label htmlFor="email">Email</label>
    <input id="email" type="email" name="email" />
  </div>

  <div className="control-row">
    <div className="control">
      <label htmlFor="password">Password</label>
      <input id="password" type="password" name="password" />
    </div>
  </div>

  <p className="form-actions">
    <button type="reset" className="button button-flat">Reset</button>
    <button type="submit" className="button">Sign up</button>
  </p>
</form>
```

- 상태로 입력을 관리하고 있을 경우

```jsx
import { useState } from "react"

export default function Login() {
  const [enteredValue, setEnteredValue] = useState({
    email: "",
    password: "",
  })

  function handleSubmit(event) {
    event.preventDefault()

    console.log(enteredValue)
    setEnteredValue({
      email: "",
      password: "",
    })
  }

  function handleInputChange(identifier, event) {
    setEnteredValue((prevValue) => {
      return { ...prevValue, [identifier]: event.target.value }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <div className="control-row">
        <div className="control no-margin">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" onChange={(event) => handleInputChange("email", event)} value={enteredValue.email} />
        </div>

        <div className="control no-margin">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" onChange={(event) => handleInputChange("password", event)} value={enteredValue.password} />
        </div>
      </div>

      <p className="form-actions">
        <button className="button button-flat">Reset</button>
        <button className="button">Login</button>
      </p>
    </form>
  )
}
```

- 참조로 입력을 관리하고 있을 경우

```jsx
import { useRef } from "react"

export default function Login() {
  const email = useRef("")
  const password = useRef("")

  function handleSubmit(event) {
    event.preventDefault()

    const enteredEmail = email.current.value
    const enteredPassword = password.current.value

    console.log(enteredEmail, enteredPassword)

    // email.current.value = ""
    // password.current.value = ""
    event.target.reset()
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <div className="control-row">
        <div className="control no-margin">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" ref={email} />
        </div>

        <div className="control no-margin">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" ref={password} />
        </div>
      </div>

      <p className="form-actions">
        <button className="button button-flat">Reset</button>
        <button className="button">Login</button>
      </p>
    </form>
  )
}
```

## 유효성 검사

### Blur 상태에서의 유효성 검사

- blur는 브라우저 기본 이벤트: 해당 입력이 포커스를 잃게 될 때 발현

```jsx
import { useState } from "react"

export default function Login() {
  const [enteredValue, setEnteredValue] = useState({
    email: "",
    password: "",
  })

  const [didEdit, setDidEdit] = useState({
    email: false,
    password: false,
  })

  // email 입력이 수정된 적이 있고, email에 @가 없으면 true
  const emailIsInvalid = didEdit.email && !enteredValue.email.includes("@")
  const passwordIsInvalid = didEdit.password && enteredValue.password.length < 8

  function handleSubmit(event) {
    event.preventDefault()

    console.log(enteredValue)
  }

  function handleInputChange(identifier, event) {
    setEnteredValue((prevValue) => {
      return { ...prevValue, [identifier]: event.target.value }
    })

    // 입력을 재개하면, 오류 메시지가 제거될 수 있도록
    setDidEdit((prevEdit) => {
      return { ...prevEdit, [identifier]: false }
    })
  }

  // blur는 기본 브라우저 이벤트: 해당 입력이 포커스를 잃게 될 때 발현
  function handleInputBlur(identifier) {
    setDidEdit((prevEdit) => {
      return { ...prevEdit, [identifier]: true }
    })
  }
  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <div className="control-row">
        <div className="control no-margin">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" onBlur={() => handleInputBlur("email")} onChange={(event) => handleInputChange("email", event)} value={enteredValue.email} />
          <div className="control-error">{emailIsInvalid && <p>Please enter a valid email address.</p>}</div>
        </div>

        <div className="control no-margin">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" onBlur={() => handleInputBlur("password")} onChange={(event) => handleInputChange("password", event)} value={enteredValue.password} />
          <div className="control-error">{passwordIsInvalid && <p>Please enter a valid password.</p>}</div>
        </div>
      </div>

      <p className="form-actions">
        <button className="button button-flat">Reset</button>
        <button className="button">Login</button>
      </p>
    </form>
  )
}
```

### Form 제출 시 입력 유효성 검사

```jsx
import { useRef, useState } from "react"

export default function Login() {
  const [formIsInvalid, setFormIsInvalid] = useState({
    email: false,
    password: false,
  })

  const email = useRef("")
  const password = useRef("")

  function handleSubmit(event) {
    event.preventDefault()

    const enteredEmail = email.current.value
    const enteredPassword = password.current.value

    console.log(enteredEmail, enteredPassword)

    const emailIsInvalid = !enteredEmail.includes("@")
    if (emailIsInvalid) {
      setFormIsInvalid((prevForm) => {
        return { ...prevForm, email: true }
      })
    } else {
      setFormIsInvalid((prevForm) => {
        return { ...prevForm, email: false }
      })
    }

    const passwordIsInvalid = enteredPassword.length < 8
    if (passwordIsInvalid) {
      setFormIsInvalid((prevForm) => {
        return { ...prevForm, password: true }
      })
    } else {
      setFormIsInvalid((prevForm) => {
        return { ...prevForm, password: false }
      })
    }

    event.target.reset()
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <div className="control-row">
        <div className="control no-margin">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" ref={email} />
          <div className="control-error">{formIsInvalid.email && <p>Please enter a valid email address.</p>}</div>
        </div>

        <div className="control no-margin">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" ref={password} />
          <div className="control-error">{formIsInvalid.password && <p>Please enter a valid password.</p>}</div>
        </div>
      </div>

      <p className="form-actions">
        <button className="button button-flat">Reset</button>
        <button className="button">Login</button>
      </p>
    </form>
  )
}
```

### 내장 Props로 유효성 검사

- required: 각 타입에 맞는 요구 사항을 확인
- minLength: 최소 요구 입력 글자 수

```jsx
import { useState } from "react"

export default function Signup() {
  const [passwordAreNotEqual, setPasswordAreNotEqual] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()

    const fd = new FormData(event.target)

    // 특정 key(name)에 대한 값 추출
    const enteredEmail = fd.get("email")
    console.log("enteredEmail: " + enteredEmail)

    // 다중 선택
    const acquisitionChannel = fd.getAll("acquisition")

    // 입력된 모든 값들을 그룹화
    const data = Object.fromEntries(fd.entries())
    data.acquisition = acquisitionChannel // entry가 담지 못하는 다중 값들 덮어 씌우기

    console.log(data)

    if (data.password !== data["comfirm-password"]) {
      setPasswordAreNotEqual(true)
      return
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Welcome on board!</h2>
      <p>We just need a little bit of data from you to get you started 🚀</p>

      <div className="control">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" name="email" required />
      </div>

      <div className="control-row">
        <div className="control">
          <label htmlFor="password">Password</label>
          <input id="password" type="text" name="password" required minLength={8} />
        </div>

        <div className="control">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input id="confirm-password" type="text" name="confirm-password" required minLength={8} />
          <div className="control-error">{passwordAreNotEqual && <p>Passwords must match.</p>}</div>
        </div>
      </div>

      <hr />

      <div className="control-row">
        <div className="control">
          <label htmlFor="first-name">First Name</label>
          <input type="text" id="first-name" name="first-name" required />
        </div>

        <div className="control">
          <label htmlFor="last-name">Last Name</label>
          <input type="text" id="last-name" name="last-name" required />
        </div>
      </div>

      <div className="control">
        <label htmlFor="phone">What best describes your role?</label>
        <select id="role" name="role" required>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="employee">Employee</option>
          <option value="founder">Founder</option>
          <option value="other">Other</option>
        </select>
      </div>

      <fieldset>
        <legend>How did you find us?</legend>
        <div className="control">
          <input type="checkbox" id="google" name="acquisition" value="google" />
          <label htmlFor="google">Google</label>
        </div>

        <div className="control">
          <input type="checkbox" id="friend" name="acquisition" value="friend" />
          <label htmlFor="friend">Referred by friend</label>
        </div>

        <div className="control">
          <input type="checkbox" id="other" name="acquisition" value="other" />
          <label htmlFor="other">Other</label>
        </div>
      </fieldset>

      <div className="control">
        <label htmlFor="terms-and-conditions">
          <input type="checkbox" id="terms-and-conditions" name="terms" required />I agree to the terms and conditions
        </label>
      </div>

      <p className="form-actions">
        <button type="reset" className="button button-flat">
          Reset
        </button>
        <button type="submit" className="button">
          Sign up
        </button>
      </p>
    </form>
  )
}
```

### 재사용 가능한 Input 컴포넌트 제작

```jsx
// Input.jsx

export default function Input({ label, id, error, ...props }) {
  return (
    <div className="control no-margin">
      <label htmlFor={id}>{label}</label>
      <input id={id} type="email" name="email" {...props} />
      <div className="control-error">{error && <p>{error}</p>}</div>
    </div>
  )
}
```

```js
// util/validation.js

export function isEmail(value) {
  return value.includes("@")
}

export function isNotEmpty(value) {
  return value.trim() !== ""
}

export function hasMinLength(value, minLength) {
  return value.length >= minLength
}

export function isEqualsToOtherValue(value, otherValue) {
  return value === otherValue
}
```

```jsx
// StateLogin.jsx

import { useState } from "react"

import Input from "./Input.jsx"
import { isEmail, isNotEmpty, hasMinLength } from "../util/validation.js"

export default function Login() {
  const [enteredValue, setEnteredValue] = useState({
    email: "",
    password: "",
  })

  const [didEdit, setDidEdit] = useState({
    email: false,
    password: false,
  })

  // email 입력이 수정된 적이 있고, email에 @가 없으면 true
  const emailIsInvalid = didEdit.email && !isEmail(enteredValue.email) && isNotEmpty(enteredValue.email)
  const passwordIsInvalid = didEdit.password && !hasMinLength(enteredValue.password, 8) && isNotEmpty(enteredValue.password)

  function handleSubmit(event) {
    event.preventDefault()

    console.log(enteredValue)
  }

  function handleInputChange(identifier, event) {
    setEnteredValue((prevValue) => {
      return { ...prevValue, [identifier]: event.target.value }
    })

    // 입력을 재개하면, 오류 메시지가 제거될 수 있도록
    setDidEdit((prevEdit) => {
      return { ...prevEdit, [identifier]: false }
    })
  }

  // blur는 기본 브라우저 이벤트: 해당 입력이 포커스를 잃게 될 때 발현
  function handleInputBlur(identifier) {
    setDidEdit((prevEdit) => {
      return { ...prevEdit, [identifier]: true }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <div className="control-row">
        <Input
          label="email"
          id="email"
          type="email"
          name="email"
          error={emailIsInvalid && "Please enter a valid email."}
          onBlur={() => handleInputBlur("email")}
          onChange={(event) => handleInputChange("email", event)}
          value={enteredValue.email}
        />
        <Input
          label="password"
          id="password"
          type="password"
          name="password"
          error={passwordIsInvalid && "Please enter a valid password."}
          onBlur={() => handleInputBlur("password")}
          onChange={(event) => handleInputChange("password", event)}
          value={enteredValue.password}
        />
      </div>

      <p className="form-actions">
        <button className="button button-flat">Reset</button>
        <button className="button">Login</button>
      </p>
    </form>
  )
}
```

### 커스텀 훅으로 유효성 검사 코드 다듬기

```js
// hooks/useInput.js

import { useState } from "react"

export function useInput(defaultValue, validationFn) {
  const [enteredValue, setEnteredValue] = useState(defaultValue)
  const [didEdit, setDidEdit] = useState(false)

  const valueIsValid = validationFn(enteredValue)

  function handleInputChange(event) {
    setEnteredValue(event.target.value)
    setDidEdit(false)
  }

  function handleInputBlur(identifier) {
    setDidEdit(true)
  }

  return {
    value: enteredValue,
    handleInputChange,
    handleInputBlur,
    hasError: didEdit && !valueIsValid,
  }
}
```

```jsx
// StateLogin.jsx

import { useInput } from "../hooks/useInput.js"

import Input from "./Input.jsx"

import { isEmail, isNotEmpty, hasMinLength } from "../util/validation.js"

export default function Login() {
  const { value: emailValue, handleInputChange: handleEmailChange, handleInputBlur: handleEmailBlur, hasError: emailHasError } = useInput("", (value) => isEmail(value) && isNotEmpty(value))
  const { value: passwordValue, handleInputChange: handlePasswordChange, handleInputBlur: handlePasswordBlur, hasError: passwordHasError } = useInput("", (value) => hasMinLength(value, 8))

  function handleSubmit(event) {
    event.preventDefault()

    if (emailHasError || passwordHasError) {
      return
    }

    console.log(emailValue, passwordValue)
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <div className="control-row">
        <Input label="email" id="email" type="email" name="email" error={emailHasError && "Please enter a valid email."} onBlur={handleEmailBlur} onChange={handleEmailChange} value={emailValue} />
        <Input
          label="password"
          id="password"
          type="password"
          name="password"
          error={passwordHasError && "Please enter a valid password."}
          onBlur={handlePasswordBlur}
          onChange={handlePasswordChange}
          value={passwordValue}
        />
      </div>

      <p className="form-actions">
        <button className="button button-flat">Reset</button>
        <button className="button">Login</button>
      </p>
    </form>
  )
}
```

### React Form Library