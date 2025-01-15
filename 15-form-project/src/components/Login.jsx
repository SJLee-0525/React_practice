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
