import { Card, Progress, Tabs, Descriptions, Table, Button, Result, Row, Col, Statistic } from 'antd'
import ReactECharts from 'echarts-for-react'
import { useParams, useNavigate } from 'react-router-dom'
import StatusTag from '@/components/StatusTag'
import { getProject, projectTasks, projectPlugins, projectDocs, projectLogs } from '@/mock/project'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = getProject(id ?? '')

  if (!project) {
    return <Result status="404" title="项目不存在" extra={<Button type="primary" onClick={() => navigate('/project')}>返回列表</Button>} />
  }

  const chartOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'] },
    yAxis: { type: 'value', max: 100 },
    series: [{ data: [10, 22, 35, 48, 55, 62, 70, project.progress], type: 'line', smooth: true, areaStyle: { color: 'rgba(22,119,255,0.1)' }, lineStyle: { color: '#1677ff' } }],
  }

  const tabItems = [
    {
      key: 'overview',
      label: '项目概览',
      children: (
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="项目名称">{project.name}</Descriptions.Item>
          <Descriptions.Item label="所属行业">{project.industry}</Descriptions.Item>
          <Descriptions.Item label="项目负责人">{project.manager}</Descriptions.Item>
          <Descriptions.Item label="项目状态"><StatusTag status={project.status} /></Descriptions.Item>
          <Descriptions.Item label="开始时间">{project.startDate}</Descriptions.Item>
          <Descriptions.Item label="结束时间">{project.endDate}</Descriptions.Item>
          <Descriptions.Item label="项目描述" span={2}>{project.description}</Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: 'tasks',
      label: '任务管理',
      children: (
        <Table size="small" rowKey="id" dataSource={projectTasks} columns={[
          { title: '任务名称', dataIndex: 'name' },
          { title: '负责人', dataIndex: 'assignee' },
          { title: '状态', dataIndex: 'status', render: (s: string) => <StatusTag status={s} /> },
          { title: '截止日期', dataIndex: 'deadline' },
        ]} pagination={false} />
      ),
    },
    {
      key: 'plugins',
      label: '插件服务',
      children: (
        <Table size="small" rowKey="name" dataSource={projectPlugins} columns={[
          { title: '插件名称', dataIndex: 'name' },
          { title: '状态', dataIndex: 'status' },
          { title: '使用量', dataIndex: 'usage' },
        ]} pagination={false} />
      ),
    },
    {
      key: 'stats',
      label: '数据统计',
      children: (
        <Row gutter={16}>
          <Col span={16}><ReactECharts option={chartOption} style={{ height: 300 }} /></Col>
          <Col span={8}>
            <Card bordered={false}><Statistic title="AI 任务数" value={1280} /></Card>
            <Card bordered={false} style={{ marginTop: 16 }}><Statistic title="数据处理量" value="856 GB" /></Card>
            <Card bordered={false} style={{ marginTop: 16 }}><Statistic title="知识库文档" value={2382} /></Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'docs',
      label: '项目文档',
      children: (
        <Table size="small" rowKey="name" dataSource={projectDocs} columns={[
          { title: '文档名称', dataIndex: 'name' },
          { title: '大小', dataIndex: 'size' },
          { title: '更新时间', dataIndex: 'updatedAt' },
          { title: '操作', render: () => <Button type="link" size="small">下载</Button> },
        ]} pagination={false} />
      ),
    },
    {
      key: 'logs',
      label: '操作日志',
      children: (
        <Table size="small" rowKey="time" dataSource={projectLogs} columns={[
          { title: '时间', dataIndex: 'time', width: 180 },
          { title: '操作人', dataIndex: 'user', width: 100 },
          { title: '操作内容', dataIndex: 'action' },
        ]} pagination={false} />
      ),
    },
  ]

  return (
    <div>
      <Button type="link" onClick={() => navigate('/project')} style={{ padding: 0, marginBottom: 16 }}>← 返回项目列表</Button>
      <Card bordered={false} style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, marginBottom: 8 }}>{project.name}</h3>
            <StatusTag status={project.status} />
          </div>
          <div style={{ width: 300 }}>
            <div style={{ marginBottom: 4, textAlign: 'right', color: '#64748b' }}>项目进度 {project.progress}%</div>
            <Progress percent={project.progress} />
          </div>
        </div>
      </Card>
      <Card bordered={false}><Tabs items={tabItems} /></Card>
    </div>
  )
}
