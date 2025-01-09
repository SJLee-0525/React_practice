import Button from "./Button"

export default function ProjectSidebar({onSelectMain, onStartAddProject, projects, onSelectProject, selectedProjectId}) {
    return (
        <aside className="w-1/3 px-8 py-16 bg-stone-900 text-stone-50 md:w-72 rounded-r-xl">
            <button onClick={onSelectMain}>
                <h1 className="mb-8 font-bold uppercase md:text-xl text-stone-200 hover:font-bold hover:text-orange-500 hover:transition-all">Your Projects</h1>
            </button>
            <div>
                <Button onClick={onStartAddProject}>+ Add Project</Button>
            </div>
            <ul className="mt-8">
                {projects.map((project) => {
                    let cssClasses = "w-full text-left px-2 py-1 my-0.5 rounded-md y-1"

                    if (project.id  === selectedProjectId) {
                        cssClasses += " font-bold text-stone-200 bg-orange-500"
                    } else {
                        cssClasses += " text-stone-400 hover:font-bold hover:text-orange-500 hover:bg-stone-800 hover:transition-all"
                    }

                    return (
                        <li key={project.id}>
                            <button
                                className={cssClasses}
                                onClick={() => onSelectProject(project.id)}
                            >
                                {project.title}
                            </button>
                        </li>
                    )
                })}
            </ul>
        </aside>
    )
}