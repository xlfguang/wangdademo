import { Card } from 'antd'
import type { ReactNode } from 'react'
import styles from './index.module.css'

interface FeatureCardProps {
  title: string
  description: string
  items?: string[]
  icon?: ReactNode
  onClick?: () => void
}

export default function FeatureCard({ title, description, items, icon, onClick }: FeatureCardProps) {
  return (
    <Card
      className={`${styles.card} card-hover${onClick ? ` ${styles.clickable}` : ''}`}
      bordered={false}
      onClick={onClick}
    >
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.title}>{title}</div>
      <div className={styles.desc}>{description}</div>
      {items && (
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </Card>
  )
}
