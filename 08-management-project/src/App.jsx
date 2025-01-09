import { useState } from 'react'

import ProjectSidebar from "./components/sidebar/ProjectSidebar.jsx";
import NewProject from "./components/projects/NewProject.jsx";
import NoProjectSelected from "./components/projects/NoProjectSelected.jsx";
import SelectedProject from './components/projects/SelectedProject.jsx';

function App() {
  const [projectState, setProjectState] = useState({
    currentAction: 'nothing-selected',
    selectedProjectId: undefined,
    projects: [],
    tasks: []
  })

  function handleSelectMain () {
    setProjectState((prevState) => {
      return ({
        ...prevState,
        currentAction: 'nothing-selected',
        selectedProjectId: undefined,
      })
    })
  }

  function handleStartAddProject () {
    setProjectState((prevState) => {
      return {
        ...prevState,
        currentAction: 'adding'
      }
    })
  }

  function handleAddProject (projectData) {
    setProjectState((prevState) => {
      const projectId = Math.random()

      const newProject = {
        title: projectData.title,
        description: projectData.description,
        dueDate: projectData.dueDate,
        id: projectId
      }

      return {
        ...prevState,
        currentAction: 'nothing-selected',
        projects: [...prevState.projects, newProject]
      }
    })
  }

  function handleCancelAddProject () {
    setProjectState((prevState) => {
      return ({
        ...prevState,
        currentAction: 'nothing-selected'
      })
    })
  }

  function handleSelectProject(id) {
    setProjectState((prevState) => {
      return ({
        ...prevState,
        currentAction: 'selected',
        selectedProjectId: id
      })
    })
  }

  function handleDeleteProject() {
    setProjectState((prevState) => {
      return ({
        ...prevState,
        currentAction: 'nothing-selected',
        selectedProjectId: undefined,
        projects: [...prevState.projects.filter((project) => {
          return project.id !== prevState.selectedProjectId
          // 이전에 선택됐던 project id가 삭제되는거니까..
        })]
      })
    })
  }

  function handleAddTask(text) {
    setProjectState((prevState) => {
      const taskId = Math.random()
      const newTask = {
        projectId: prevState.selectedProjectId,
        id: taskId,
        task: text
      }
      return {
        ...prevState,
        tasks: [
          ...prevState.tasks,
          newTask
        ]
      }
    })
  }

  function handleDeleteTask(taskId) {
    setProjectState((prevState) => {
      return ({
        ...prevState,
        tasks: prevState.tasks.filter((task) => {
          return (task.id !== taskId)
        })
      })
    })

  }

  console.log(projectState)

  const selectedProject = projectState.projects.find((project) => {
    return (project.id === projectState.selectedProjectId)
  })

  let content
  if (projectState.currentAction === 'nothing-selected') {
    content = <NoProjectSelected onStartAddProject={handleStartAddProject} />
  } else if (projectState.currentAction === 'adding') {
    content = <NewProject onAdd={handleAddProject} onCancel={handleCancelAddProject} />
  } else if (projectState.currentAction === 'selected') {
    content = <SelectedProject 
      project={selectedProject} 
      onDelete={handleDeleteProject}
      tasks={projectState.tasks} 
      onAddTask={handleAddTask}
      onDeleteTask={handleDeleteTask}
    />
  }

  return (
    <main className="h-screen my-8 flex gap-8">
      <ProjectSidebar
        onSelectMain={handleSelectMain}
        onStartAddProject={handleStartAddProject} 
        projects={projectState.projects}
        onSelectProject={handleSelectProject}
        selectedProjectId={projectState.selectedProjectId}
      />
      <div className="mx-auto">
        {content}
      </div>
    </main>
  );
}

export default App;
