import { Outlet } from 'react-router-dom'
import { DataCleanProvider } from './DataCleanContext'

export default function DataCleanLayout() {
  return (
    <DataCleanProvider>
      <Outlet />
    </DataCleanProvider>
  )
}
