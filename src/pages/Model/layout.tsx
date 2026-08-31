import { Outlet } from 'react-router-dom'
import { ModelProvider } from './ModelContext'

export default function ModelLayout() {
  return (
    <ModelProvider>
      <Outlet />
    </ModelProvider>
  )
}
