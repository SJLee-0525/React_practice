import NewTask from "./NewTask"

export default function Task({ tasks, onAddTask, onDeleteTask}) {
    return (
        <section>
            <h3 className="text-xl font-bold text-stone-700 mb-4">Task</h3>
            {tasks.length === 0 && (
                <>
                    <p className="text-stone-800 mb-4">This project does not have any tasks yet.</p>
                    <NewTask className="my-4" onAddTask={onAddTask} />
                </>
            )}
            {tasks.length > 0 && (
                <>
                    <NewTask onAddTask={onAddTask} />
                    <ul className="p-4 my-4 rounded-md bg-stone-100">
                        {tasks.map((task, index) => {
                            return (
                                <>
                                    <li key={task.id} className="flex justify-between items-center">
                                        <span>{task.task}</span>
                                        <button
                                            className="p-1.5 text-sm rounded-md text-red-600 hover:font-bold hover:text-stone-50 hover:bg-red-700 hover:transition-all"
                                            onClick={() => onDeleteTask(task.id)}
                                        >
                                            Clear
                                        </button>
                                    </li>
                                    {index !== tasks.length - 1 && <hr className="my-4"/>}
                                </>
                            )
                        })}
                    </ul>
                </>
            )}
        </section>
    )
}