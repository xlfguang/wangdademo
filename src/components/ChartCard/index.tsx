import { Card } from 'antd'
import type { ReactNode } from 'react'
import styles from './index.module.css'

interface ChartCardProps {
  title: string
  children: ReactNode
}

export default function ChartCard({ title, children }: ChartCardProps) {
  return (
    <Card title={title} className={styles.card} bordered={false}>
      {children}
    </Card>
  )
}
