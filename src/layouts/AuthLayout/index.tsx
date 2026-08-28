import { Outlet } from 'react-router-dom'
import styles from './index.module.css'

export default function AuthLayout() {
  return (
    <div className={styles.wrapper}>
      <Outlet />
    </div>
  )
}
