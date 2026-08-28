import { Row, Col, Card, Table, Button, Steps } from 'antd'
import { ThunderboltOutlined, AudioOutlined, CheckCircleOutlined, ClockCircleOutlined, ApiOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import StatCard from '@/components/StatCard'
import FeatureCard from '@/components/FeatureCard'
import StatusTag from '@/components/StatusTag'
import AudioSubNav from './components/AudioSubNav'
import { useAudioContext } from './AudioContext'
import { audioPluginMeta, audioOverviewStats, audioScenarios } from '@/mock/audio'
import { formatNumber } from '@/utils/format'
import { buildDeepLink } from '@/utils/deepLink'
import { audioScenarioLinks } from '@/config/capabilityLinks'
import styles from './index.module.css'

const icons = [<AudioOutlined />, <AudioOutlined />, <AudioOutlined />, <AudioOutlined />, <AudioOutlined />]

export default function Overview() {
  const navigate = useNavigate()
  const { tasks } = useAudioContext()

  const columns = [
    { title: '任务名称', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '音频文件', dataIndex: 'audioFile', key: 'audioFile', ellipsis: true },
    { title: '处理类型', dataIndex: 'processType', key: 'processType' },
    { title: '时长', dataIndex: 'duration', key: 'duration' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <StatusTag status={s} /> },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
    { title: '操作', key: 'action', render: (_: unknown, r: typeof tasks[0]) => <Button type="link" size="small" onClick={() => navigate(`/audio/task/${r.id}`)}>查看</Button> },
  ]

  return (
    <div>
      <AudioSubNav />
      <div className={styles.pluginHeader}>
        <div>
          <div className={styles.pluginTitle}>{audioPluginMeta.name}</div>
          <div className={styles.pluginDesc}>{audioPluginMeta.description}</div>
          <div style={{ marginTop: 8 }}><StatusTag status={audioPluginMeta.status} /> <span style={{ marginLeft: 8, color: 'var(--color-text-secondary)' }}>{audioPluginMeta.version}</span></div>
        </div>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={8} lg={4}><StatCard title="总处理任务" value={formatNumber(audioOverviewStats.totalTasks)} icon={<ThunderboltOutlined />} /></Col>
        <Col xs={12} sm={8} lg={5}><StatCard title="今日处理音频" value={audioOverviewStats.todayProcessed} icon={<AudioOutlined />} /></Col>
        <Col xs={12} sm={8} lg={5}><StatCard title="累计转写时长" value={audioOverviewStats.totalTranscriptHours} icon={<ClockCircleOutlined />} /></Col>
        <Col xs={12} sm={8} lg={5}><StatCard title="识别准确率" value={`${audioOverviewStats.accuracyRate}%`} icon={<CheckCircleOutlined />} /></Col>
        <Col xs={12} sm={8} lg={5}><StatCard title="API 调用次数" value={formatNumber(audioOverviewStats.apiCalls)} icon={<ApiOutlined />} /></Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {audioScenarios.map((s, i) => {
          const link = audioScenarioLinks[s.title]
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
        <Steps items={['上传音频', '裁剪片段', '语音转文字', '提取关键信息'].map((t) => ({ title: t }))} />
      </Card>
      <Card title="最近任务" bordered={false} style={{ marginTop: 16, boxShadow: 'var(--shadow-card)' }}>
        <Table columns={columns} dataSource={tasks.slice(0, 6)} rowKey="id" pagination={false} size="middle" />
      </Card>
    </div>
  )
}
