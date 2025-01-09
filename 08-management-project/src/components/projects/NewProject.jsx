import { useRef } from 'react'

import Input from "./Input.jsx"
import Modal from '../modals/Modal.jsx'

export default function NewProject({onAdd, onCancel}) {
    const modal = useRef()

    // 버튼을 눌렀을 때만 Input 내의 값을 읽을 거기에 Refs 사용
    const title = useRef('')
    const description = useRef('')
    const dueDate = useRef('')

    function handleSave () {
        const enteredTitle = title.current.value
        const enteredDescription = description.current.value
        const enteredDuedate = dueDate.current.value

        // 유효성 검사
        if (enteredTitle.trim() === '' || enteredDescription.trim() === '' || enteredDuedate.trim() === '') {
            // 오류 모달 띄우기
            modal.current.open()
            return
        }

        onAdd({
            title: enteredTitle,
            description: enteredDescription,
            dueDate: enteredDuedate
        })
    }

    return (
        <>
            <Modal ref={modal} buttonCaption="Close">
                <h2 className="text-xl font-bold text-stone-700 my-4">Invalid Input</h2>
                <p className="text-stone-600 mb-4">Oops ... looks like you forgot to enter a value.</p>
                <p className="text-stone-600 mb-4">Please make sure you provide a valid value for every input field.</p>
            </Modal>
            <div className="w-[35rem] mt-16">
                <menu className="flex items-center justify-end gap-4 my-4">
                    <li>
                        <button 
                            className="text-stone-800 hover:text-stone-950"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                    </li>
                    <li>
                        <button 
                            className="px-6 py-2 rounded-md bg-stone-800 text-stone-50 hover:bg-orange-500 hover:transition-all"
                            onClick={handleSave}>
                            Save
                        </button>
                    </li>
                </menu>
                <div>
                    <Input type="text" ref={title} label="Title" />
                    <Input ref={description} label="Description" isTextarea />
                    <Input type="date" ref={dueDate} label="Due Date" />
                </div>
            </div>
        </>
    )
}