import { Outlet } from 'react-router-dom'
import { VideoTaskProvider } from './VideoTaskContext'

export default function VideoLayout() {
  return (
    <VideoTaskProvider>
      <Outlet />
    </VideoTaskProvider>
  )
}
