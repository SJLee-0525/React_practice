import { useRef, forwardRef, useImperativeHandle } from "react"
import { createPortal } from "react-dom"

const ResultModal = forwardRef(function ResultModal({ targetTime, remainingTime, onReset }, ref) {
  const dialog = useRef()

  const userLost = remainingTime <= 0
  const formattedRemainingTime = (remainingTime / 1000).toFixed(2) // 소수점 둘째 자리까지
  const score = Math.round((1 - remainingTime / (targetTime * 1000)) * 100)

  useImperativeHandle(ref, () => ({
    open() {
      dialog.current.showModal()
    },
  }))

  return createPortal(
    // <dialog>를 사용하면 esc눌러 모달을 닫을 수 있음
    // 하지만 close 버튼으로 닫는 것이 아니기에 form의 onSubmit이 호출되지 않음
    // dialog에 onClose 속성을 추가하면 esc 누르는 것으로 함수 호출 가능능
    <dialog className="result-modal" ref={dialog} onClose={onReset}>
      {userLost && <h2>You lost</h2>}
      {!userLost && <h2>Your Score: {score}</h2>}
      <p>
        The target time was <strong>{targetTime} seconds.</strong>
      </p>
      <p>
        You stopped the timer with <strong>{formattedRemainingTime} seconds left.</strong>
      </p>
      <form method="dialog" onSubmit={onReset}>
        <button>Close</button>
      </form>
    </dialog>,
    document.getElementById("modal")
  )
})

export default ResultModal
