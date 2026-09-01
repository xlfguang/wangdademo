import { Row, Col, Card, Table, Button, Steps } from 'antd'
import { ThunderboltOutlined, CheckCircleOutlined, ClockCircleOutlined, AuditOutlined, TeamOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import StatCard from '@/components/StatCard'
import FeatureCard from '@/components/FeatureCard'
import StatusTag from '@/components/StatusTag'
import TaskSubNav from './components/TaskSubNav'
import TaskStatusTag from './components/TaskStatusTag'
import { useTaskContext } from './TaskContext'
import { useMenuData } from '@/mock/useMenuData'
import type { TaskData } from '@/mock/task'
import { formatNumber } from '@/utils/format'
import { buildDeepLink } from '@/utils/deepLink'
import { taskScenarioLinks } from '@/config/capabilityLinks'
import styles from './index.module.css'

const icons = [<ThunderboltOutlined />, <ClockCircleOutlined />, <TeamOutlined />, <AuditOutlined />, <CheckCircleOutlined />]

export default function Overview() {
  const navigate = useNavigate()
  const { tasks } = useTaskContext()
  const { data } = useMenuData<TaskData>('task')
  const { taskPluginMeta, taskOverviewStats, taskScenarios } = data
  const rootTasks = tasks.filter((t) => !t.parentId)

  const columns = [
    { title: '任务名称', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '负责人', dataIndex: 'owner', key: 'owner' },
    { title: '优先级', dataIndex: 'priority', key: 'priority', render: (p: string) => p === 'high' ? '高' : p === 'medium' ? '中' : '低' },
    { title: '进度', dataIndex: 'progress', key: 'progress', render: (v: number) => `${v}%` },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: typeof tasks[0]['status']) => <TaskStatusTag status={s} /> },
    { title: '截止时间', dataIndex: 'endDate', key: 'endDate' },
    { title: '操作', key: 'action', render: (_: unknown, r: typeof tasks[0]) => <Button type="link" size="small" onClick={() => navigate(`/task/task/${r.id}`)}>查看</Button> },
  ]

  return (
    <div>
      <TaskSubNav />
      <div className={styles.pluginHeader}>
        <div>
          <div className={styles.pluginTitle}>{taskPluginMeta.name}</div>
          <div className={styles.pluginDesc}>{taskPluginMeta.description}</div>
          <div style={{ marginTop: 8 }}><StatusTag status={taskPluginMeta.status} /> <span style={{ marginLeft: 8, color: 'var(--color-text-secondary)' }}>{taskPluginMeta.version}</span></div>
        </div>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={8} lg={4}><StatCard title="总任务数" value={formatNumber(taskOverviewStats.totalTasks)} icon={<ThunderboltOutlined />} /></Col>
        <Col xs={12} sm={8} lg={5}><StatCard title="完成率" value={`${taskOverviewStats.completedRate}%`} icon={<CheckCircleOutlined />} /></Col>
        <Col xs={12} sm={8} lg={5}><StatCard title="超时任务" value={taskOverviewStats.overdueCount} icon={<ClockCircleOutlined />} /></Col>
        <Col xs={12} sm={8} lg={5}><StatCard title="待验收" value={taskOverviewStats.pendingAcceptance} icon={<AuditOutlined />} /></Col>
        <Col xs={12} sm={8} lg={5}><StatCard title="活跃成员" value={taskOverviewStats.activeMembers} icon={<TeamOutlined />} /></Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {taskScenarios.map((s, i) => {
          const link = taskScenarioLinks[s.title]
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
      <Card title="核心协作流程" bordered={false} style={{ marginTop: 16, boxShadow: 'var(--shadow-card)' }}>
        <Steps items={['任务拆解', '进度跟踪', '文档协作', '跨岗联动', '成果闭环'].map((t) => ({ title: t }))} />
      </Card>
      <Card title="进行中的总任务" bordered={false} style={{ marginTop: 16, boxShadow: 'var(--shadow-card)' }}>
        <Table columns={columns} dataSource={rootTasks.slice(0, 5)} rowKey="id" pagination={false} size="middle" />
      </Card>
    </div>
  )
}
