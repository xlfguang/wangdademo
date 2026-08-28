import { Outlet } from 'react-router-dom'
import { DataProvider } from './DataContext'

export default function DataLayout() {
  return (
    <DataProvider>
      <Outlet />
    </DataProvider>
  )
}
