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
