import { Outlet } from 'react-router-dom'
import { TaskProvider } from './TaskContext'

export default function TaskLayout() {
  return (
    <TaskProvider>
      <Outlet />
    </TaskProvider>
  )
}
