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

## 유효성 검사
