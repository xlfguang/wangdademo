import { Row, Col, Card, Statistic, Table, Button, Result } from 'antd'
import ReactECharts from 'echarts-for-react'
import { useParams, useNavigate } from 'react-router-dom'
import { reportDashboard } from '@/mock/data'
import { getReport } from '@/mock/data'

export default function ReportDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const report = getReport(id ?? '')

  if (!report) {
    return <Result status="404" title="报表不存在" extra={<Button type="primary" onClick={() => navigate('/data/reports')}>返回列表</Button>} />
  }

  const lineOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
    yAxis: { type: 'value' },
    series: [{ type: 'line', smooth: true, data: [820, 932, 901, 934, 1290, 1330, 1320], areaStyle: { color: 'rgba(22,119,255,0.1)' } }],
  }

  const barOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['华东', '华南', '华北', '西南'] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [3200, 2800, 2100, 1600], itemStyle: { color: '#1677ff' } }],
  }

  const pieOption = {
    tooltip: { trigger: 'item' },
    series: [{ type: 'pie', radius: '60%', data: [{ name: '移动端', value: 62 }, { name: 'PC端', value: 28 }, { name: '其他', value: 10 }] }],
  }

  const tableData = [
    { key: '1', region: '华东', sales: 3200000, orders: 15600, growth: '+5.2%' },
    { key: '2', region: '华南', sales: 2800000, orders: 12800, growth: '+3.1%' },
    { key: '3', region: '华北', sales: 2100000, orders: 9800, growth: '-1.2%' },
    { key: '4', region: '西南', sales: 1600000, orders: 7400, growth: '+8.6%' },
  ]

  return (
    <div>
      <Button type="link" onClick={() => navigate('/data/reports')} style={{ padding: 0, marginBottom: 16 }}>← 返回报表中心</Button>
      <h3 style={{ marginBottom: 16 }}>{report.name}</h3>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card bordered={false}><Statistic title="销售额" value={reportDashboard.sales / 10000} suffix="万" precision={0} /></Card></Col>
        <Col span={6}><Card bordered={false}><Statistic title="用户数" value={reportDashboard.users} /></Card></Col>
        <Col span={6}><Card bordered={false}><Statistic title="订单量" value={reportDashboard.orders} /></Card></Col>
        <Col span={6}><Card bordered={false}><Statistic title="转化率" value={reportDashboard.conversion} suffix="%" precision={2} /></Card></Col>
      </Row>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}><Card title="销售趋势" bordered={false}><ReactECharts option={lineOption} style={{ height: 240 }} /></Card></Col>
        <Col span={8}><Card title="区域对比" bordered={false}><ReactECharts option={barOption} style={{ height: 240 }} /></Card></Col>
        <Col span={8}><Card title="渠道分布" bordered={false}><ReactECharts option={pieOption} style={{ height: 240 }} /></Card></Col>
      </Row>
      <Card title="明细数据" bordered={false}>
        <Table size="small" dataSource={tableData} columns={[
          { title: '区域', dataIndex: 'region' },
          { title: '销售额', dataIndex: 'sales', render: (v: number) => v.toLocaleString() },
          { title: '订单量', dataIndex: 'orders', render: (v: number) => v.toLocaleString() },
          { title: '增长率', dataIndex: 'growth' },
        ]} pagination={false} />
      </Card>
    </div>
  )
}
