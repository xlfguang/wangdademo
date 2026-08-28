import { Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated } from '@/utils/auth'
import type { ReactNode } from 'react'

export default function AuthGuard({ children }: { children: ReactNode }) {
  const location = useLocation()
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return <>{children}</>
}
