import { Row, Col, Card, Table, Button, Steps } from 'antd'
import { ThunderboltOutlined, CloudDownloadOutlined, AlertOutlined, FireOutlined, ApiOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import StatCard from '@/components/StatCard'
import FeatureCard from '@/components/FeatureCard'
import StatusTag from '@/components/StatusTag'
import CrawlerSubNav from './components/CrawlerSubNav'
import { useCrawlerContext } from './CrawlerContext'
import { useMenuData } from '@/mock/useMenuData'
import type { CrawlerData } from '@/mock/crawler'
import { formatNumber } from '@/utils/format'
import { buildDeepLink } from '@/utils/deepLink'
import { crawlerScenarioLinks } from '@/config/capabilityLinks'
import styles from './index.module.css'

const icons = [<CloudDownloadOutlined />, <FireOutlined />, <ThunderboltOutlined />, <AlertOutlined />, <ApiOutlined />]

export default function Overview() {
  const navigate = useNavigate()
  const { tasks } = useCrawlerContext()
  const { data } = useMenuData<CrawlerData>('crawler')
  const { crawlerPluginMeta, crawlerOverviewStats, crawlerScenarios } = data

  const columns = [
    { title: '任务名称', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '关键词', dataIndex: 'keyword', key: 'keyword', ellipsis: true },
    { title: '数据源', dataIndex: 'dataSource', key: 'dataSource' },
    { title: '采集进度', key: 'progress', render: (_: unknown, r: typeof tasks[0]) => `${r.collectedCount}/${r.collectCount}` },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <StatusTag status={s} /> },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
    { title: '操作', key: 'action', render: (_: unknown, r: typeof tasks[0]) => <Button type="link" size="small" onClick={() => navigate(`/crawler/task/${r.id}`)}>查看</Button> },
  ]

  return (
    <div>
      <CrawlerSubNav />
      <div className={styles.pluginHeader}>
        <div>
          <div className={styles.pluginTitle}>{crawlerPluginMeta.name}</div>
          <div className={styles.pluginDesc}>{crawlerPluginMeta.description}</div>
          <div style={{ marginTop: 8 }}><StatusTag status={crawlerPluginMeta.status} /> <span style={{ marginLeft: 8, color: 'var(--color-text-secondary)' }}>{crawlerPluginMeta.version}</span></div>
        </div>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={8} lg={4}><StatCard title="总检索任务" value={formatNumber(crawlerOverviewStats.totalTasks)} icon={<ThunderboltOutlined />} /></Col>
        <Col xs={12} sm={8} lg={5}><StatCard title="今日采集量" value={formatNumber(crawlerOverviewStats.todayCollected)} icon={<CloudDownloadOutlined />} /></Col>
        <Col xs={12} sm={8} lg={5}><StatCard title="舆情热点数" value={crawlerOverviewStats.hotspotCount} icon={<FireOutlined />} /></Col>
        <Col xs={12} sm={8} lg={5}><StatCard title="预警次数" value={crawlerOverviewStats.alertCount} icon={<AlertOutlined />} /></Col>
        <Col xs={12} sm={8} lg={5}><StatCard title="API 调用次数" value={formatNumber(crawlerOverviewStats.apiCalls)} icon={<ApiOutlined />} /></Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {crawlerScenarios.map((s, i) => {
          const link = crawlerScenarioLinks[s.title]
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
        <Steps items={['配置数据源', '关键词检索', '数据抓取去重', '舆情监控预警'].map((t) => ({ title: t }))} />
      </Card>
      <Card title="最近任务" bordered={false} style={{ marginTop: 16, boxShadow: 'var(--shadow-card)' }}>
        <Table columns={columns} dataSource={tasks.slice(0, 6)} rowKey="id" pagination={false} size="middle" />
      </Card>
    </div>
  )
}
