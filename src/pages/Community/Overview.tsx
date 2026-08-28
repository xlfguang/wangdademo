import { Row, Col, Card, Table, Steps } from 'antd'
import { useNavigate } from 'react-router-dom'
import { TeamOutlined, MessageOutlined, RobotOutlined, SendOutlined, ApiOutlined } from '@ant-design/icons'
import StatCard from '@/components/StatCard'
import FeatureCard from '@/components/FeatureCard'
import StatusTag from '@/components/StatusTag'
import CommunitySubNav from './components/CommunitySubNav'
import { communityPluginMeta, communityOverviewStats, communityScenarios, communityGroups } from '@/mock/community'
import { formatNumber } from '@/utils/format'
import { buildDeepLink } from '@/utils/deepLink'
import { communityScenarioLinks } from '@/config/capabilityLinks'
import styles from './index.module.css'

const icons = [<MessageOutlined />, <RobotOutlined />, <SendOutlined />, <TeamOutlined />, <ApiOutlined />]

export default function Overview() {
  const navigate = useNavigate()
  const columns = [
    { title: '社群名称', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '成员数', dataIndex: 'memberCount', key: 'memberCount', render: (v: number) => formatNumber(v) },
    { title: '活跃度', dataIndex: 'activity', key: 'activity', render: (v: number) => `${v}%` },
    { title: '最后活跃', dataIndex: 'lastActive', key: 'lastActive' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <StatusTag status={s} /> },
  ]

  return (
    <div>
      <CommunitySubNav />
      <div className={styles.pluginHeader}>
        <div>
          <div className={styles.pluginTitle}>{communityPluginMeta.name}</div>
          <div className={styles.pluginDesc}>{communityPluginMeta.description}</div>
          <div style={{ marginTop: 8 }}>
            <StatusTag status={communityPluginMeta.status} />
            <span style={{ marginLeft: 8, color: 'var(--color-text-secondary)' }}>{communityPluginMeta.version}</span>
          </div>
        </div>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={8} lg={4}><StatCard title="管理社群数" value={communityOverviewStats.totalGroups} icon={<TeamOutlined />} /></Col>
        <Col xs={12} sm={8} lg={5}><StatCard title="今日消息量" value={formatNumber(communityOverviewStats.todayMessages)} icon={<MessageOutlined />} /></Col>
        <Col xs={12} sm={8} lg={5}><StatCard title="AI 自动回复率" value={`${communityOverviewStats.aiReplyRate}%`} icon={<RobotOutlined />} /></Col>
        <Col xs={12} sm={8} lg={5}><StatCard title="推送触达率" value={`${communityOverviewStats.pushReachRate}%`} icon={<SendOutlined />} /></Col>
        <Col xs={12} sm={8} lg={5}><StatCard title="API 调用次数" value={formatNumber(communityOverviewStats.apiCalls)} icon={<ApiOutlined />} /></Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {communityScenarios.map((s, i) => {
          const link = communityScenarioLinks[s.title]
          return (
            <Col xs={24} sm={12} lg={8} key={s.title}>
              <FeatureCard
                {...s}
                icon={icons[i]}
                onClick={link ? () => navigate(buildDeepLink(link.path, link.params)) : undefined}
              />
            </Col>
          )
        })}
      </Row>
      <Card title="核心处理流程" bordered={false} style={{ marginTop: 16, boxShadow: 'var(--shadow-card)' }}>
        <Steps items={['消息聚合', '意图识别', '智能回复/转人工', '精准推送触达'].map((t) => ({ title: t }))} />
      </Card>
      <Card title="最近社群" bordered={false} style={{ marginTop: 16, boxShadow: 'var(--shadow-card)' }}>
        <Table columns={columns} dataSource={communityGroups.slice(0, 6)} rowKey="id" pagination={false} size="middle" />
      </Card>
    </div>
  )
}
