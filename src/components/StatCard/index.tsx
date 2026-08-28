import { Card, Statistic } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import type { ReactNode } from 'react'
import styles from './index.module.css'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  icon?: ReactNode
  suffix?: string
  onClick?: () => void
}

export default function StatCard({ title, value, change, icon, suffix, onClick }: StatCardProps) {
  return (
    <Card
      className={`${styles.card} card-hover${onClick ? ` ${styles.clickable}` : ''}`}
      bordered={false}
      onClick={onClick}
    >
      <div className={styles.content}>
        <div>
          <div className={styles.title}>{title}</div>
          <Statistic
            value={value}
            suffix={suffix}
            valueStyle={{ fontSize: 28, fontWeight: 600, color: '#0f172a' }}
          />
          {change !== undefined && (
            <div className={styles.change}>
              {change >= 0 ? (
                <ArrowUpOutlined style={{ color: '#22c55e' }} />
              ) : (
                <ArrowDownOutlined style={{ color: '#ef4444' }} />
              )}
              <span style={{ color: change >= 0 ? '#22c55e' : '#ef4444' }}>
                较昨日 {change >= 0 ? '+' : ''}{change}%
              </span>
            </div>
          )}
        </div>
        {icon && <div className={styles.icon}>{icon}</div>}
      </div>
    </Card>
  )
}
