import type { ReactNode } from 'react'
import { Row, Col, Card, Table, Button, Tag, List } from 'antd'
import {
  ThunderboltOutlined,
  PlayCircleOutlined,
  DatabaseOutlined,
  AppstoreOutlined,
  VideoCameraOutlined,
  SoundOutlined,
  SearchOutlined,
  BookOutlined,
  ClearOutlined,
  BarChartOutlined,
} from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import { useNavigate } from 'react-router-dom'
import StatCard from '@/components/StatCard'
import ChartCard from '@/components/ChartCard'
import StatusTag from '@/components/StatusTag'
import { getGreeting, formatNumber } from '@/utils/format'
import {
  dashboardStats,
  taskTrendData,
  pluginUsageData,
  taskStatusData,
  recentTasks,
  pendingTodos,
  dashboardQuickActions,
} from '@/mock/dashboard'
import styles from './index.module.css'

const quickActionIcons: Record<string, ReactNode> = {
  video: <VideoCameraOutlined />,
  audio: <SoundOutlined />,
  data: <BarChartOutlined />,
  crawler: <SearchOutlined />,
  knowledge: <BookOutlined />,
  clean: <ClearOutlined />,
}

const priorityColor: Record<string, string> = {
  high: 'red',
  medium: 'orange',
  low: 'default',
}

export default function Dashboard() {
  const navigate = useNavigate()

  const lineOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 20, bottom: 30 },
    xAxis: { type: 'category', data: taskTrendData.dates, boundaryGap: false },
    yAxis: { type: 'value' },
    series: [{
      data: taskTrendData.values,
      type: 'line',
      smooth: true,
      areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [
        { offset: 0, color: 'rgba(22,119,255,0.3)' },
        { offset: 1, color: 'rgba(22,119,255,0.02)' },
      ]}},
      lineStyle: { color: '#1677ff', width: 2 },
      itemStyle: { color: '#1677ff' },
    }],
  }

  const barOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 20, bottom: 30 },
    xAxis: { type: 'category', data: pluginUsageData.map((d) => d.name), axisLabel: { rotate: 15, fontSize: 11 } },
    yAxis: { type: 'value' },
    series: [{
      data: pluginUsageData.map((d) => d.value),
      type: 'bar',
      barWidth: 32,
      itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [
        { offset: 0, color: '#1677ff' },
        { offset: 1, color: '#69b1ff' },
      ]}, borderRadius: [4, 4, 0, 0] },
    }],
  }

  const pieOption = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, left: 'center' },
    series: [{
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '45%'],
      data: taskStatusData.map((d) => ({ name: d.name, value: d.value })),
      label: { show: false },
      itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
      color: ['#1677ff', '#22c55e', '#f59e0b', '#ef4444'],
    }],
  }

  const columns = [
    { title: '任务名称', dataIndex: 'name', key: 'name' },
    { title: '类型', dataIndex: 'type', key: 'type' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <StatusTag status={s} /> },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: typeof recentTasks[0]) => (
        <Button type="link" size="small" onClick={() => navigate(record.route)}>查看</Button>
      ),
    },
  ]

  return (
    <div className="page-container">
      <div className={styles.welcome}>
        <h2>{getGreeting()}，管理员</h2>
        <p>欢迎使用网达智能体调度平台</p>
        <div className={styles.quickStats}>
          <span>今日运行任务 <strong>{dashboardStats.runningTasks}</strong></span>
          <span>AI 调用次数 <strong>{formatNumber(dashboardStats.aiCalls)}</strong></span>
          <span>处理数据 <strong>{dashboardStats.dataProcessed}</strong></span>
          <span>知识库文档 <strong>{formatNumber(dashboardStats.knowledgeDocs)}</strong></span>
        </div>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={14}>
          <Card title="待办聚合" bordered={false} className={styles.recentCard}>
            <List
              dataSource={pendingTodos}
              renderItem={(item) => (
                <List.Item
                  actions={[<Button key="go" type="link" size="small" onClick={() => navigate(item.route)}>处理</Button>]}
                >
                  <List.Item.Meta
                    title={
                      <span>
                        <Tag color={priorityColor[item.priority]} style={{ marginRight: 8 }}>{item.category}</Tag>
                        {item.title}
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="插件快捷操作" bordered={false} className={styles.recentCard}>
            <div className={styles.quickActions}>
              {dashboardQuickActions.map((action) => (
                <Button
                  key={action.label}
                  icon={quickActionIcons[action.icon]}
                  onClick={() => navigate(action.route)}
                  className={styles.quickActionBtn}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="AI 任务总量" value={formatNumber(dashboardStats.totalTasks)} change={dashboardStats.totalTasksChange} icon={<ThunderboltOutlined />} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="正在运行" value={dashboardStats.runningTasks} icon={<PlayCircleOutlined />} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="数据处理量" value={dashboardStats.dataProcessed} icon={<DatabaseOutlined />} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="服务项目" value={dashboardStats.serviceProjects} icon={<AppstoreOutlined />} />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={10}>
          <ChartCard title="过去 7 天 AI 任务执行数量">
            <ReactECharts option={lineOption} style={{ height: 280 }} />
          </ChartCard>
        </Col>
        <Col xs={24} lg={8}>
          <ChartCard title="插件使用情况">
            <ReactECharts option={barOption} style={{ height: 280 }} />
          </ChartCard>
        </Col>
        <Col xs={24} lg={6}>
          <ChartCard title="任务状态分布">
            <ReactECharts option={pieOption} style={{ height: 280 }} />
          </ChartCard>
        </Col>
      </Row>

      <Card title="最近任务" className={styles.recentCard} bordered={false} style={{ marginTop: 16 }}>
        <Table columns={columns} dataSource={recentTasks} rowKey="id" pagination={false} size="middle" />
      </Card>
    </div>
  )
}
