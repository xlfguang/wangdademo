import { Outlet } from 'react-router-dom'
import { CommunityProvider } from './CommunityContext'

export default function CommunityLayout() {
  return (
    <CommunityProvider>
      <Outlet />
    </CommunityProvider>
  )
}
