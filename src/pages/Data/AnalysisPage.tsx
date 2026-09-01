import { useState } from 'react'
import { Row, Col, Card, Form, Select, DatePicker, Button, Statistic, Segmented, message } from 'antd'
import ReactECharts from 'echarts-for-react'
import DataSubNav from './components/DataSubNav'
import ExportReportButton from '@/components/ExportReportButton'
import { useMenuData } from '@/mock/useMenuData'
import type { DataMenuData } from '@/mock/data'
import { delay } from '@/utils/mockApi'

const { RangePicker } = DatePicker

export default function Analysis() {
  const { data } = useMenuData<DataMenuData>('data')
  const { analysisStats, salesTrend, regionCompare, correlationData } = data
  const [period, setPeriod] = useState('月')
  const [analyzed, setAnalyzed] = useState(true)

  const handleAnalyze = async () => {
    await delay(500)
    setAnalyzed(true)
    message.success('分析完成')
  }

  const lineOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: salesTrend.months },
    yAxis: { type: 'value' },
    series: [{ type: 'line', smooth: true, data: salesTrend.values, areaStyle: { color: 'rgba(22,119,255,0.1)' }, lineStyle: { color: '#1677ff' } }],
  }

  const barOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: regionCompare.map((d) => d.name) },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: regionCompare.map((d) => d.value), itemStyle: { color: '#1677ff', borderRadius: [4, 4, 0, 0] } }],
  }

  const scatterOption = {
    tooltip: { trigger: 'item' },
    xAxis: { name: '销售额', type: 'value' },
    yAxis: { name: '用户活跃度', type: 'value' },
    series: [{ type: 'scatter', data: correlationData, itemStyle: { color: '#7c5cfc' } }],
  }

  return (
    <div>
      <DataSubNav />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <ExportReportButton
          filename="data-analysis"
          data={[
            { metric: '数据总量', value: analysisStats.total },
            { metric: '平均值', value: analysisStats.avg },
            ...salesTrend.months.map((m, i) => ({ month: m, sales: salesTrend.values[i] })),
          ]}
        />
      </div>
      <Card bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
        <Form layout="inline">
          <Form.Item label="选择数据集"><Select defaultValue="sales" style={{ width: 160 }} options={[{ label: '销售数据集', value: 'sales' }, { label: '用户行为数据集', value: 'behavior' }]} /></Form.Item>
          <Form.Item label="分析维度"><Select defaultValue="region" style={{ width: 140 }} options={[{ label: '区域', value: 'region' }, { label: '时间', value: 'time' }, { label: '产品', value: 'product' }]} /></Form.Item>
          <Form.Item label="时间范围"><RangePicker /></Form.Item>
          <Form.Item><Button type="primary" onClick={handleAnalyze}>开始分析</Button></Form.Item>
        </Form>
      </Card>

      {analyzed && (
        <>
          <Card title="数据统计" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
            <Row gutter={16}>
              <Col span={4}><Statistic title="数据总量" value={analysisStats.total} /></Col>
              <Col span={4}><Statistic title="平均值" value={analysisStats.avg} precision={1} /></Col>
              <Col span={4}><Statistic title="最大值" value={analysisStats.max} /></Col>
              <Col span={4}><Statistic title="最小值" value={analysisStats.min} /></Col>
              <Col span={4}><Statistic title="中位数" value={analysisStats.median} /></Col>
              <Col span={4}><Statistic title="标准差" value={analysisStats.stdDev} precision={1} /></Col>
            </Row>
          </Card>
          <Row gutter={16}>
            <Col span={12}>
              <Card title="近6个月销售额趋势" bordered={false} extra={<Segmented options={['日', '周', '月', '季度']} value={period} onChange={(v) => setPeriod(v as string)} />} style={{ boxShadow: 'var(--shadow-card)' }}>
                <ReactECharts option={lineOption} style={{ height: 280 }} />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="区域数据对比" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
                <ReactECharts option={barOption} style={{ height: 280 }} />
              </Card>
            </Col>
          </Row>
          <Card title="相关性分析（销售额 vs 用户活跃度，相关系数：0.82）" bordered={false} style={{ marginTop: 16, boxShadow: 'var(--shadow-card)' }}>
            <ReactECharts option={scatterOption} style={{ height: 300 }} />
          </Card>
        </>
      )}
    </div>
  )
}
