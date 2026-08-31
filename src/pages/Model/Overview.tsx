import { Row, Col, Card, Table, Button, Steps, Tag } from 'antd'
import {
  AppstoreOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ApiOutlined,
  ThunderboltOutlined,
  RiseOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import ReactECharts from 'echarts-for-react'
import StatCard from '@/components/StatCard'
import ChartCard from '@/components/ChartCard'
import StatusTag from '@/components/StatusTag'
import ModelSubNav from './components/ModelSubNav'
import { useModelContext } from './ModelContext'
import {
  modelPluginMeta,
  modelOverviewStats,
  modelCallTrend,
  modelProcessSteps,
  modelTypeLabels,
  modelTypeColors,
} from '@/mock/model'
import type { AiModel } from '@/mock/model'
import { formatNumber } from '@/utils/format'
import styles from './index.module.css'

export default function Overview() {
  const navigate = useNavigate()
  const { models } = useModelContext()
  const recentModels = models.slice(0, 6)

  const barOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: 50, right: 20, top: 30, bottom: 30 },
    xAxis: { type: 'category', data: modelCallTrend.dates },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (v: number) => (v >= 10000 ? `${(v / 10000).toFixed(1)}w` : String(v)),
      },
    },
    series: [{
      type: 'bar',
      data: modelCallTrend.values,
      itemStyle: { color: '#1677ff', borderRadius: [4, 4, 0, 0] },
      barWidth: '50%',
    }],
  }

  const columns = [
    { title: '模型名称', dataIndex: 'name', key: 'name', ellipsis: true },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (t: AiModel['type']) => (
        <Tag color={modelTypeColors[t]}>{modelTypeLabels[t]}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => <StatusTag status={s} />,
    },
    { title: '最近调用', dataIndex: 'lastCallAt', key: 'lastCallAt' },
    {
      title: '调用次数',
      dataIndex: 'callCount',
      key: 'callCount',
      render: (v: number) => formatNumber(v),
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Button type="link" size="small" onClick={() => navigate('/model/manage')}>管理</Button>
      ),
    },
  ]

  return (
    <div>
      <ModelSubNav />
      <div className={styles.pluginHeader}>
        <div>
          <div className={styles.pluginTitle}>{modelPluginMeta.name}</div>
          <div className={styles.pluginDesc}>{modelPluginMeta.description}</div>
          <div className={styles.pluginMeta}>
            <StatusTag status={modelPluginMeta.status} />
            <span className={styles.versionTag}>{modelPluginMeta.version}</span>
          </div>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/model/manage')}>
          新增模型
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={12} sm={8} lg={4}>
          <StatCard title="模型总数" value={`${modelOverviewStats.total} 个`} icon={<AppstoreOutlined />} />
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <StatCard title="启用中" value={`${modelOverviewStats.enabled} 个`} icon={<CheckCircleOutlined />} />
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <StatCard title="已停用" value={`${modelOverviewStats.disabled} 个`} icon={<CloseCircleOutlined />} />
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <StatCard title="已分配插件" value={`${modelOverviewStats.assignedPlugins} 个`} icon={<ApiOutlined />} />
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <StatCard title="累计调用" value={`${formatNumber(modelOverviewStats.totalCalls)} 次`} icon={<ThunderboltOutlined />} />
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <StatCard title="调用成功率" value={`${modelOverviewStats.successRate}%`} icon={<RiseOutlined />} />
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={14}>
          <ChartCard title="近 7 天模型调用趋势">
            <ReactECharts option={barOption} style={{ height: 280 }} />
          </ChartCard>
        </Col>
        <Col span={10}>
          <Card title="核心处理流程" bordered={false} style={{ boxShadow: 'var(--shadow-card)', height: '100%' }}>
            <Steps
              direction="vertical"
              current={3}
              items={modelProcessSteps.map((title) => ({ title }))}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="最近模型"
        bordered={false}
        style={{ marginTop: 16, boxShadow: 'var(--shadow-card)' }}
        extra={<Button type="link" onClick={() => navigate('/model/manage')}>查看全部 &gt;</Button>}
      >
        <Table columns={columns} dataSource={recentModels} rowKey="id" pagination={false} size="middle" />
      </Card>
    </div>
  )
}
