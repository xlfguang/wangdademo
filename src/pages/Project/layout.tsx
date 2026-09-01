import { Outlet } from 'react-router-dom'
import { ProjectProvider } from './ProjectContext'

export default function ProjectLayout() {
  return (
    <ProjectProvider>
      <Outlet />
    </ProjectProvider>
  )
}
