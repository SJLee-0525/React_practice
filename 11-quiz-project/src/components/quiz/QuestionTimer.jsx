import { useState, useEffect } from "react"

export default function QuestionTimer({ timeout, onTimeout, mode }) {
  const [remainingTime, setRemainingTime] = useState(timeout)

  useEffect(() => {
    // console.log("Set Timer")
    const timer = setTimeout(onTimeout, timeout)

    return () => {
      clearTimeout(timer)
    }
  }, [timeout, onTimeout])

  useEffect(() => {
    // console.log("Set Interval")
    const interval = setInterval(() => {
      setRemainingTime((prevRemainingTime) => {
        return prevRemainingTime - 10
      })
    }, 10)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return <progress id="question-time" max={timeout} value={remainingTime} className={mode} />
}
