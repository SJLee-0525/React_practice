import { useState } from 'react'

export default function NewTask({onAddTask}) {
    const [enteredTask, setEnteredTask] = useState('')

    function handleChange(event) {
        setEnteredTask(event.target.value)
    }

    function handleClick() {
        if (enteredTask.trim() === '') {
            return
        }
        onAddTask(enteredTask)
        setEnteredTask('')
    }

    return (
        <div className="flex items-center gap-4">
            <input 
                type="text" 
                className="w-5/6 px-2 py-1 rounded-md bg-stone-200" 
                onChange={handleChange}
                value={enteredTask}
            />
            <button className="w-1/6 p-1.5 rounded-md text-sm bg-stone-700 text-stone-50 hover:font-bold hover:bg-stone-900 hover:transition-all" onClick={handleClick}>Add Task</button>
        </div>
    )
}