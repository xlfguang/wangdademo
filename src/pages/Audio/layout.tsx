import { Outlet } from 'react-router-dom'
import { AudioProvider } from './AudioContext'

export default function AudioLayout() {
  return (
    <AudioProvider>
      <Outlet />
    </AudioProvider>
  )
}
