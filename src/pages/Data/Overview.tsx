import { Row, Col, Card, Table, Progress } from 'antd'
import { useNavigate } from 'react-router-dom'
import ReactECharts from 'echarts-for-react'
import { DatabaseOutlined, CloudUploadOutlined, ThunderboltOutlined, CheckCircleOutlined, WarningOutlined, ApiOutlined } from '@ant-design/icons'
import StatCard from '@/components/StatCard'
import ChartCard from '@/components/ChartCard'
import StatusTag from '@/components/StatusTag'
import DataSubNav from './components/DataSubNav'
import { useDataContext } from './DataContext'
import { useMenuData } from '@/mock/useMenuData'
import type { DataMenuData } from '@/mock/data'
import { formatNumber } from '@/utils/format'
import { buildDeepLink } from '@/utils/deepLink'
import { dataStatLinks } from '@/config/capabilityLinks'
import styles from './index.module.css'

export default function Overview() {
  const navigate = useNavigate()
  const { governanceTasks } = useDataContext()
  const { data } = useMenuData<DataMenuData>('data')
  const { dataPluginMeta, dataOverviewStats, dataTrend, dataSourceDistribution, qualityOverview, dataTasks } = data
  const recentTasks = [...governanceTasks.slice(0, 3), ...dataTasks.slice(0, 3)].slice(0, 6)

  const lineOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['数据接入量', '数据处理量'] },
    grid: { left: 40, right: 20, top: 40, bottom: 30 },
    xAxis: { type: 'category', data: dataTrend.dates },
    yAxis: { type: 'value' },
    series: [
      { name: '数据接入量', type: 'line', smooth: true, data: dataTrend.ingest, itemStyle: { color: '#1677ff' } },
      { name: '数据处理量', type: 'line', smooth: true, data: dataTrend.process, itemStyle: { color: '#7c5cfc' } },
    ],
  }

  const pieOption = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [{
      type: 'pie', radius: ['40%', '65%'], center: ['50%', '45%'],
      data: dataSourceDistribution.map((d) => ({ name: d.name, value: d.value })),
      color: ['#1677ff', '#7c5cfc', '#22c55e', '#f59e0b', '#ef4444', '#69b1ff', '#64748b'],
    }],
  }

  const recentRows = recentTasks.map((t) => ({
    id: t.id,
    name: t.name,
    dataSource: t.dataSource,
    dataVolume: t.dataVolume,
    status: t.status,
    time: 'createdAt' in t && t.createdAt ? t.createdAt : ('updatedAt' in t ? t.updatedAt : ''),
    processType: 'processType' in t ? t.processType : ('cleanRules' in t ? '数据治理' : '数据处理'),
  }))

  const columns = [
    { title: '任务名称', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '数据源', dataIndex: 'dataSource', key: 'dataSource' },
    { title: '处理类型', dataIndex: 'processType', key: 'processType' },
    { title: '数据量', dataIndex: 'dataVolume', key: 'dataVolume' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <StatusTag status={s} /> },
    { title: '时间', dataIndex: 'time', key: 'time' },
  ]

  return (
    <div>
      <DataSubNav />
      <div className={styles.pluginHeader}>
        <div>
          <div className={styles.pluginTitle}>{dataPluginMeta.name}</div>
          <div className={styles.pluginDesc}>{dataPluginMeta.description}</div>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={12} sm={8} lg={4}><StatCard title="数据源数量" value={dataOverviewStats.sourceCount} icon={<DatabaseOutlined />} onClick={() => navigate(buildDeepLink(dataStatLinks['数据源数量'].path, dataStatLinks['数据源数量'].params))} /></Col>
        <Col xs={12} sm={8} lg={4}><StatCard title="今日接入数据量" value={dataOverviewStats.todayVolume} icon={<CloudUploadOutlined />} onClick={() => navigate(buildDeepLink(dataStatLinks['今日接入数据量'].path, dataStatLinks['今日接入数据量'].params))} /></Col>
        <Col xs={12} sm={8} lg={4}><StatCard title="数据处理任务" value={dataOverviewStats.taskCount} icon={<ThunderboltOutlined />} onClick={() => navigate(buildDeepLink(dataStatLinks['数据处理任务'].path, dataStatLinks['数据处理任务'].params))} /></Col>
        <Col xs={12} sm={8} lg={4}><StatCard title="数据质量评分" value={`${dataOverviewStats.qualityScore}`} icon={<CheckCircleOutlined />} onClick={() => navigate(buildDeepLink(dataStatLinks['数据质量评分'].path, dataStatLinks['数据质量评分'].params))} /></Col>
        <Col xs={12} sm={8} lg={4}><StatCard title="异常数据量" value={formatNumber(dataOverviewStats.abnormalCount)} icon={<WarningOutlined />} onClick={() => navigate(buildDeepLink(dataStatLinks['异常数据量'].path, dataStatLinks['异常数据量'].params))} /></Col>
        <Col xs={12} sm={8} lg={4}><StatCard title="API 调用次数" value={formatNumber(dataOverviewStats.apiCalls)} icon={<ApiOutlined />} onClick={() => navigate(buildDeepLink(dataStatLinks['API 调用次数'].path, dataStatLinks['API 调用次数'].params))} /></Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={14}>
          <ChartCard title="数据接入趋势（近7天）">
            <ReactECharts option={lineOption} style={{ height: 280 }} />
          </ChartCard>
        </Col>
        <Col span={10}>
          <ChartCard title="数据源分布">
            <ReactECharts option={pieOption} style={{ height: 280 }} />
          </ChartCard>
        </Col>
      </Row>

      <Card title="数据质量概览" bordered={false} style={{ marginTop: 16, boxShadow: 'var(--shadow-card)' }}>
        <Row gutter={16}>
          {Object.entries(qualityOverview).map(([key, val]) => (
            <Col span={6} key={key} className={styles.qualityRing}>
              <Progress type="circle" percent={val} size={100} strokeColor="#1677ff" />
              <div style={{ marginTop: 8, color: 'var(--color-text-secondary)' }}>
                {{ completeness: '完整性', accuracy: '准确性', consistency: '一致性', uniqueness: '唯一性' }[key]}
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      <Card title="最近任务" bordered={false} style={{ marginTop: 16, boxShadow: 'var(--shadow-card)' }}>
        <Table columns={columns} dataSource={recentRows} rowKey="id" pagination={false} size="middle" />
      </Card>
    </div>
  )
}
