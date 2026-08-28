import { Row, Col, Card, Table, Button } from 'antd'
import {
  ThunderboltOutlined,
  PlayCircleOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
  ApiOutlined,
  ScissorOutlined,
  SwapOutlined,
  CompressOutlined,
  PictureOutlined,
  FontSizeOutlined,
  RobotOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import StatCard from '@/components/StatCard'
import FeatureCard from '@/components/FeatureCard'
import StatusTag from '@/components/StatusTag'
import VideoSubNav from './components/VideoSubNav'
import { useVideoTasks } from './VideoTaskContext'
import {
  videoPluginMeta,
  videoOverviewStats,
  videoCapabilities,
} from '@/mock/video'
import { formatNumber } from '@/utils/format'
import { buildDeepLink } from '@/utils/deepLink'
import { videoCapabilityLinks } from '@/config/capabilityLinks'
import styles from './index.module.css'

const icons = [
  <ScissorOutlined />,
  <SwapOutlined />,
  <CompressOutlined />,
  <PictureOutlined />,
  <FontSizeOutlined />,
  <RobotOutlined />,
]

export default function Overview() {
  const navigate = useNavigate()
  const { tasks } = useVideoTasks()
  const recentTasks = tasks.slice(0, 6)

  const columns = [
    { title: '任务名称', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '处理类型', dataIndex: 'processType', key: 'processType' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <StatusTag status={s} /> },
    { title: '进度', dataIndex: 'progress', key: 'progress', render: (p: number) => `${p}%` },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: typeof recentTasks[0]) => (
        <Button type="link" size="small" onClick={() => navigate(`/video/task/${record.id}`)}>查看</Button>
      ),
    },
  ]

  return (
    <div>
      <VideoSubNav />
      <div className={styles.pluginHeader}>
        <div>
          <div className={styles.pluginTitle}>{videoPluginMeta.name}</div>
          <div className={styles.pluginDesc}>{videoPluginMeta.description}</div>
          <div className={styles.pluginMeta}>
            <StatusTag status={videoPluginMeta.status} />
            <span className={styles.versionTag}>{videoPluginMeta.version}</span>
          </div>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8} xl={4}>
          <StatCard title="总处理任务" value={formatNumber(videoOverviewStats.totalTasks)} icon={<ThunderboltOutlined />} />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={5}>
          <StatCard title="当前运行任务" value={videoOverviewStats.runningTasks} icon={<PlayCircleOutlined />} />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={5}>
          <StatCard title="视频处理量" value={videoOverviewStats.processedVolume} icon={<DatabaseOutlined />} />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={5}>
          <StatCard title="任务成功率" value={`${videoOverviewStats.successRate}%`} icon={<CheckCircleOutlined />} />
        </Col>
        <Col xs={24} sm={12} lg={8} xl={5}>
          <StatCard title="API 调用次数" value={formatNumber(videoOverviewStats.apiCalls)} icon={<ApiOutlined />} />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {videoCapabilities.map((cap, i) => {
          const link = videoCapabilityLinks[cap.title]
          return (
            <Col xs={24} sm={12} lg={8} key={cap.title}>
              <FeatureCard
                {...cap}
                icon={icons[i]}
                onClick={link ? () => navigate(buildDeepLink(link.path, link.params)) : undefined}
              />
            </Col>
          )
        })}
      </Row>

      <Card title="最近任务" bordered={false} style={{ marginTop: 16, boxShadow: 'var(--shadow-card)' }}>
        <Table columns={columns} dataSource={recentTasks} rowKey="id" pagination={false} size="middle" />
      </Card>
    </div>
  )
}
