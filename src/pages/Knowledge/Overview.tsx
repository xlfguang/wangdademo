import { Row, Col, Card, Table, Button, Steps } from 'antd'
import {
  DatabaseOutlined, FileTextOutlined, SearchOutlined,
  SyncOutlined, ApartmentOutlined, BookOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import StatCard from '@/components/StatCard'
import FeatureCard from '@/components/FeatureCard'
import StatusTag from '@/components/StatusTag'
import KnowledgeSubNav from './components/KnowledgeSubNav'
import { useKnowledgeContext } from './KnowledgeContext'
import { knowledgePluginMeta, knowledgeOverviewStats, knowledgeScenarios } from '@/mock/knowledge'
import { formatNumber } from '@/utils/format'
import { buildDeepLink } from '@/utils/deepLink'
import { knowledgeScenarioLinks } from '@/config/capabilityLinks'
import styles from './index.module.css'

const icons = [
  <ApartmentOutlined />, <BookOutlined />, <DatabaseOutlined />,
  <FileTextOutlined />, <SearchOutlined />,
]

export default function Overview() {
  const navigate = useNavigate()
  const { syncTasks } = useKnowledgeContext()

  const columns = [
    { title: '任务名称', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '知识库', dataIndex: 'kbName', key: 'kbName' },
    { title: '数据源', dataIndex: 'source', key: 'source', ellipsis: true },
    { title: '同步频率', dataIndex: 'frequency', key: 'frequency' },
    { title: '文档数', dataIndex: 'docCount', key: 'docCount' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <StatusTag status={s} /> },
    { title: '最近同步', dataIndex: 'lastSync', key: 'lastSync' },
    { title: '操作', key: 'action', render: () => <Button type="link" size="small" onClick={() => navigate('/knowledge/sync')}>查看</Button> },
  ]

  return (
    <div>
      <KnowledgeSubNav />
      <div className={styles.pluginHeader}>
        <div>
          <div className={styles.pluginTitle}>{knowledgePluginMeta.name}</div>
          <div className={styles.pluginDesc}>{knowledgePluginMeta.description}</div>
          <div style={{ marginTop: 8 }}>
            <StatusTag status={knowledgePluginMeta.status} />
            <span style={{ marginLeft: 8, color: 'var(--color-text-secondary)' }}>{knowledgePluginMeta.version}</span>
          </div>
        </div>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={8} lg={4}><StatCard title="知识库总数" value={knowledgeOverviewStats.totalBases} icon={<DatabaseOutlined />} /></Col>
        <Col xs={12} sm={8} lg={5}><StatCard title="文档总量" value={formatNumber(knowledgeOverviewStats.totalDocs)} icon={<FileTextOutlined />} /></Col>
        <Col xs={12} sm={8} lg={5}><StatCard title="向量片段数" value={formatNumber(knowledgeOverviewStats.totalVectors)} icon={<ApartmentOutlined />} /></Col>
        <Col xs={12} sm={8} lg={5}><StatCard title="今日检索次数" value={formatNumber(knowledgeOverviewStats.todaySearches)} icon={<SearchOutlined />} /></Col>
        <Col xs={12} sm={8} lg={5}><StatCard title="同步任务数" value={knowledgeOverviewStats.syncTaskCount} icon={<SyncOutlined />} /></Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {knowledgeScenarios.map((s, i) => {
          const link = knowledgeScenarioLinks[s.title]
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
        <Steps items={['文档上传', '结构化处理', '向量入库', '内容审核', '智能检索'].map((t) => ({ title: t }))} />
      </Card>
      <Card title="最近同步任务" bordered={false} style={{ marginTop: 16, boxShadow: 'var(--shadow-card)' }}>
        <Table columns={columns} dataSource={syncTasks.slice(0, 5)} rowKey="id" pagination={false} size="middle" />
      </Card>
    </div>
  )
}
