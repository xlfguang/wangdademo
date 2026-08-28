import { Card, Row, Col, Tag, Statistic, Progress } from 'antd'
import PageHeader from '@/components/PageHeader'
import CommunitySubNav from './components/CommunitySubNav'
import { userPortraits, lifecycleStats, strategyEffectStats } from '@/mock/community'
import type { LifecycleStage } from '@/types'
import styles from './index.module.css'

const lifecycleLabels: Record<LifecycleStage, { label: string; color: string }> = {
  new: { label: '新用户', color: 'blue' },
  active: { label: '活跃', color: 'green' },
  silent: { label: '沉默', color: 'orange' },
  churned: { label: '流失', color: 'red' },
  vip: { label: 'VIP', color: 'purple' },
}

const maxLifecycleCount = Math.max(...lifecycleStats.map((s) => s.count))

export default function Portrait() {
  return (
    <div>
      <CommunitySubNav />
      <PageHeader title="用户画像" description="标签体系、生命周期分析与策略效果统计" />
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
            <Statistic title="精准推送转化率" value={strategyEffectStats.pushConversionRate} suffix="%" valueStyle={{ color: '#1677ff' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
            <Statistic title="留存提升" value={strategyEffectStats.retentionLift} suffix="%" valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
            <Statistic title="复购率" value={strategyEffectStats.repurchaseRate} suffix="%" valueStyle={{ color: '#7c5cfc' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
            <Statistic title="平均响应时间" value={strategyEffectStats.avgResponseTime} valueStyle={{ color: '#fa8c16' }} />
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} lg={8}>
          <Card title="生命周期分布" bordered={false} style={{ boxShadow: 'var(--shadow-card)', marginBottom: 16 }}>
            {lifecycleStats.map((item) => (
              <div key={item.stage} className={styles.lifecycleBar}>
                <span className={styles.lifecycleLabel}>{item.label}</span>
                <Progress
                  percent={Math.round((item.count / maxLifecycleCount) * 100)}
                  format={() => item.count.toLocaleString()}
                  strokeColor={item.color}
                  style={{ flex: 1 }}
                />
              </div>
            ))}
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Row gutter={[16, 16]}>
            {userPortraits.map((user) => {
              const lc = lifecycleLabels[user.lifecycle]
              return (
                <Col xs={24} sm={12} key={user.id}>
                  <Card className={styles.portraitCard} bordered={false}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: 16 }}>{user.nickname}</span>
                      <Tag color={lc.color}>{lc.label}</Tag>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 8 }}>ID: {user.userId}</div>
                    <div style={{ marginBottom: 12 }}>
                      {user.tags.map((tag) => <Tag key={tag} style={{ marginBottom: 4 }}>{tag}</Tag>)}
                    </div>
                    <Row gutter={8}>
                      <Col span={8}><Statistic title="消息数" value={user.messageCount} valueStyle={{ fontSize: 18 }} /></Col>
                      <Col span={8}><Statistic title="回复率" value={user.responseRate} suffix="%" valueStyle={{ fontSize: 18 }} /></Col>
                      <Col span={8}><Statistic title="策略效果" value={user.strategyEffect ?? 0} suffix="%" valueStyle={{ fontSize: 18, color: '#7c5cfc' }} /></Col>
                    </Row>
                    <div style={{ marginTop: 8, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                      偏好渠道：{user.preferredChannel} · 最后活跃：{user.lastActive}
                    </div>
                  </Card>
                </Col>
              )
            })}
          </Row>
        </Col>
      </Row>
    </div>
  )
}
