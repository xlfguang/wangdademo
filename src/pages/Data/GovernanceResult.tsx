import { Row, Col, Card, Statistic, Button } from 'antd'
import ReactECharts from 'echarts-for-react'
import { useNavigate } from 'react-router-dom'
import DataSubNav from './components/DataSubNav'
import { useMenuData } from '@/mock/useMenuData'
import type { DataMenuData } from '@/mock/data'

export default function GovernanceResult() {
  const navigate = useNavigate()
  const { data } = useMenuData<DataMenuData>('data')
  const r = data.governanceResult

  const barOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['治理前', '治理后'] },
    xAxis: { type: 'category', data: r.beforeAfter.dimensions },
    yAxis: { type: 'value', max: 100 },
    series: [
      { name: '治理前', type: 'bar', data: r.beforeAfter.before, itemStyle: { color: '#94a3b8' } },
      { name: '治理后', type: 'bar', data: r.beforeAfter.after, itemStyle: { color: '#1677ff' } },
    ],
  }

  const pieOption = {
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie', radius: '65%',
      data: r.issueDistribution.map((d) => ({ name: d.name, value: d.value })),
      color: ['#1677ff', '#7c5cfc', '#f59e0b', '#ef4444'],
    }],
  }

  return (
    <div>
      <DataSubNav />
      <Button type="link" onClick={() => navigate('/data/governance')} style={{ padding: 0, marginBottom: 16 }}>← 返回数据治理</Button>
      <Card title="数据治理结果" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
        <Row gutter={[16, 16]}>
          <Col span={4}><Statistic title="原始数据" value={r.original} suffix="条" /></Col>
          <Col span={4}><Statistic title="有效数据" value={r.valid} suffix="条" valueStyle={{ color: '#22c55e' }} /></Col>
          <Col span={4}><Statistic title="清洗数据" value={r.cleaned} suffix="条" /></Col>
          <Col span={4}><Statistic title="重复数据" value={r.duplicate} suffix="条" valueStyle={{ color: '#f59e0b' }} /></Col>
          <Col span={4}><Statistic title="异常数据" value={r.abnormal} suffix="条" valueStyle={{ color: '#ef4444' }} /></Col>
          <Col span={4}><Statistic title="缺失数据" value={r.missing} suffix="条" /></Col>
        </Row>
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Statistic title="治理后质量评分" value={r.qualityScore} valueStyle={{ fontSize: 48, color: '#1677ff' }} />
        </div>
      </Card>
      <Row gutter={16}>
        <Col span={14}>
          <Card title="数据治理前后对比" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
            <ReactECharts option={barOption} style={{ height: 320 }} />
          </Card>
        </Col>
        <Col span={10}>
          <Card title="数据问题分布" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
            <ReactECharts option={pieOption} style={{ height: 320 }} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
