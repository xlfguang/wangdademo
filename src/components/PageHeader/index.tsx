import { Typography, Space } from 'antd'
import type { ReactNode } from 'react'
import styles from './index.module.css'

const { Title, Text } = Typography

interface PageHeaderProps {
  title: string
  description?: string
  extra?: ReactNode
}

export default function PageHeader({ title, description, extra }: PageHeaderProps) {
  return (
    <div className={styles.header}>
      <div>
        <Title level={4} className={styles.title}>{title}</Title>
        {description && <Text type="secondary">{description}</Text>}
      </div>
      {extra && <Space>{extra}</Space>}
    </div>
  )
}
