import { Outlet } from 'react-router-dom'
import { CrawlerProvider } from './CrawlerContext'

export default function CrawlerLayout() {
  return (
    <CrawlerProvider>
      <Outlet />
    </CrawlerProvider>
  )
}
