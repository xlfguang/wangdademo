import { Row, Col, Card, Progress, Table, Button } from 'antd'
import ReactECharts from 'echarts-for-react'
import StatusTag from '@/components/StatusTag'
import DataSubNav from './components/DataSubNav'
import { useMenuData } from '@/mock/useMenuData'
import type { DataMenuData } from '@/mock/data'

export default function Quality() {
  const { data } = useMenuData<DataMenuData>('data')
  const { qualityMetrics, qualityTrend, qualityAlerts } = data
  const lineOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: qualityTrend.dates, axisLabel: { interval: 4 } },
    yAxis: { type: 'value', min: 90, max: 100 },
    series: [{ type: 'line', smooth: true, data: qualityTrend.values.map((v) => +v.toFixed(1)), lineStyle: { color: '#1677ff' }, areaStyle: { color: 'rgba(22,119,255,0.08)' } }],
  }

  const columns = [
    { title: '告警时间', dataIndex: 'time', key: 'time' },
    { title: '数据源', dataIndex: 'dataSource', key: 'dataSource' },
    { title: '异常类型', dataIndex: 'alertType', key: 'alertType' },
    { title: '异常数量', dataIndex: 'count', key: 'count' },
    { title: '严重程度', dataIndex: 'severity', key: 'severity', render: (s: string) => <StatusTag status={s} /> },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <StatusTag status={s} /> },
    { title: '操作', key: 'action', render: () => <Button type="link" size="small">处理</Button> },
  ]

  const metrics = [
    { label: '完整性', value: qualityMetrics.completeness },
    { label: '准确性', value: qualityMetrics.accuracy },
    { label: '一致性', value: qualityMetrics.consistency },
    { label: '唯一性', value: qualityMetrics.uniqueness },
    { label: '及时性', value: qualityMetrics.timeliness },
  ]

  return (
    <div>
      <DataSubNav />
      <Card bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
        <Row gutter={16} align="middle">
          <Col span={4} style={{ textAlign: 'center' }}>
            <Progress type="dashboard" percent={qualityMetrics.overall} strokeColor="#1677ff" size={120} />
            <div style={{ marginTop: 8, fontWeight: 600 }}>整体质量评分</div>
          </Col>
          {metrics.map((m) => (
            <Col span={4} key={m.label} style={{ textAlign: 'center' }}>
              <Progress type="circle" percent={m.value} size={80} strokeColor="#1677ff" />
              <div style={{ marginTop: 8, color: 'var(--color-text-secondary)' }}>{m.label}</div>
            </Col>
          ))}
        </Row>
      </Card>
      <Card title="过去30天数据质量变化" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
        <ReactECharts option={lineOption} style={{ height: 280 }} />
      </Card>
      <Card title="异常告警" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
        <Table columns={columns} dataSource={qualityAlerts} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  )
}
