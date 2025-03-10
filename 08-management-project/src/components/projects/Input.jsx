// ref는 다른 컴포넌트를 참고할 수 없기에 forwardRef 사용
import { forwardRef } from "react"

const classes = "w-full p-1 border-b-2 rounded-md border-stone-300 bg-stone-200 text-stone-600 focus:outline-none focus:border-stone-600"

const Input = forwardRef(function Input({ label, isTextarea, ...props }, ref) {
  return (
    <p className="flex flex-col gap-1 my-4">
      <label className="text-sm font-bold uppercase text-stone-500">{label}</label>
      {isTextarea ? <textarea ref={ref} className={classes} {...props} /> : <input ref={ref} className={classes} {...props} />}
    </p>
  )
})

export default Input
