import Button from "../sidebar/Button.jsx"
import Task from "../tasks/Task.jsx"

export default function SelectedProject({project, onDelete, tasks, onAddTask, onDeleteTask}) {
    const formattedDate = new Date(project.dueDate).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })

    const selectedTask = tasks.filter((task) => {
        return (task.projectId === project.id)
    })

    return (
        <div className="w-[35rem] mt-16">
            <header className="pb-4 mb-4 border-b-2 border-stone-300">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-stone-600 mb-2">{project.title}</h1>
                    <Button onClick={onDelete}>DELETE</Button>        
                </div>
                <p className="mb-4 text-stone-400">{formattedDate}</p>
                <p className="text-stone-600 whitespace-pre-wrap">{project.description}</p>
            </header>
            <Task onAddTask={onAddTask} onDeleteTask={onDeleteTask} tasks={selectedTask} />
        </div>
    )
}