import { Row, Col, Card, Table, Button, Steps } from 'antd'
import {
  ThunderboltOutlined, FileTextOutlined, SyncOutlined, CheckCircleOutlined, ApiOutlined, ClearOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import StatCard from '@/components/StatCard'
import FeatureCard from '@/components/FeatureCard'
import StatusTag from '@/components/StatusTag'
import DataCleanSubNav from './components/DataCleanSubNav'
import { useDataCleanContext } from './DataCleanContext'
import { useMenuData } from '@/mock/useMenuData'
import type { DataCleanData } from '@/mock/dataClean'
import { formatNumber } from '@/utils/format'
import { buildDeepLink } from '@/utils/deepLink'
import { dataCleanScenarioLinks } from '@/config/capabilityLinks'
import styles from './index.module.css'

const icons = [
  <FileTextOutlined />, <ClearOutlined />, <ThunderboltOutlined />,
  <SyncOutlined />, <CheckCircleOutlined />, <ApiOutlined />,
]

export default function Overview() {
  const navigate = useNavigate()
  const { tasks } = useDataCleanContext()
  const { data } = useMenuData<DataCleanData>('dataClean')
  const { dataCleanPluginMeta, dataCleanOverviewStats, dataCleanScenarios, pipelineLayers } = data

  const columns = [
    { title: '任务名称', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '批次号', dataIndex: 'batchNo', key: 'batchNo' },
    { title: '数据源', dataIndex: 'dataSource', key: 'dataSource' },
    { title: '数据质量', dataIndex: 'qualityRate', key: 'qualityRate', render: (v: number) => `${v}%` },
    { title: '进度', dataIndex: 'progress', key: 'progress', render: (p: number) => `${p}%` },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <StatusTag status={s} /> },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: '操作', key: 'action',
      render: (_: unknown, r: typeof tasks[0]) => (
        <Button type="link" size="small" onClick={() => navigate(`/data-clean/task/${r.id}`)}>查看</Button>
      ),
    },
  ]

  return (
    <div>
      <DataCleanSubNav />
      <div className={styles.pluginHeader}>
        <div>
          <div className={styles.pluginTitle}>{dataCleanPluginMeta.name}</div>
          <div className={styles.pluginDesc}>{dataCleanPluginMeta.description}</div>
          <div style={{ marginTop: 8 }}>
            <StatusTag status={dataCleanPluginMeta.status} />
            <span style={{ marginLeft: 8, color: 'var(--color-text-secondary)' }}>{dataCleanPluginMeta.version}</span>
          </div>
        </div>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={8} lg={4}><StatCard title="总清洗批次" value={formatNumber(dataCleanOverviewStats.totalBatches)} icon={<FileTextOutlined />} /></Col>
        <Col xs={12} sm={8} lg={5}><StatCard title="今日处理量" value={formatNumber(dataCleanOverviewStats.todayProcessed)} icon={<ThunderboltOutlined />} /></Col>
        <Col xs={12} sm={8} lg={5}><StatCard title="运行中批次" value={dataCleanOverviewStats.runningBatches} icon={<SyncOutlined />} /></Col>
        <Col xs={12} sm={8} lg={5}><StatCard title="质量通过率" value={dataCleanOverviewStats.qualityPassRate} suffix="%" icon={<CheckCircleOutlined />} /></Col>
        <Col xs={12} sm={8} lg={5}><StatCard title="API 调用次数" value={formatNumber(dataCleanOverviewStats.apiCalls)} icon={<ApiOutlined />} /></Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {dataCleanScenarios.map((s, i) => {
          const link = dataCleanScenarioLinks[s.title]
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
      <Card title="六层处理架构" bordered={false} style={{ marginTop: 16, boxShadow: 'var(--shadow-card)' }}>
        <Steps
          direction="vertical"
          size="small"
          current={2}
          items={pipelineLayers.map((l) => ({ title: `${l.layer}：${l.name}`, description: l.description }))}
        />
      </Card>
      <Card title="最近任务" bordered={false} style={{ marginTop: 16, boxShadow: 'var(--shadow-card)' }}>
        <Table columns={columns} dataSource={tasks.slice(0, 6)} rowKey="id" pagination={false} size="middle" />
      </Card>
    </div>
  )
}
