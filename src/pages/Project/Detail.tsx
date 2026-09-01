import { useState, useEffect } from 'react'
import { Card, Progress, Tabs, Descriptions, Table, Button, Result, Row, Col, Statistic, Timeline, Modal, Form, Input, Select, Tag, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import { useParams, useNavigate } from 'react-router-dom'
import StatusTag from '@/components/StatusTag'
import { useProjectContext } from './ProjectContext'
import { useMenuData } from '@/mock/useMenuData'
import type { ProjectData } from '@/mock/project'

const milestoneColor: Record<string, string> = {
  completed: 'green',
  running: 'blue',
  waiting: 'gray',
}

const milestoneLabel: Record<string, string> = {
  completed: '已完成',
  running: '进行中',
  waiting: '待开始',
}

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProject } = useProjectContext()
  const project = getProject(id ?? '')
  const { data } = useMenuData<ProjectData>('project')
  const { projectTasks, projectPlugins, projectDocs, projectLogs, projectMilestones, projectMembers } = data
  const [members, setMembers] = useState(projectMembers)

  useEffect(() => {
    setMembers(data.projectMembers)
  }, [data])
  const [memberModalOpen, setMemberModalOpen] = useState(false)
  const [form] = Form.useForm()

  if (!project) {
    return <Result status="404" title="项目不存在" extra={<Button type="primary" onClick={() => navigate('/project')}>返回列表</Button>} />
  }

  const chartOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'] },
    yAxis: { type: 'value', max: 100 },
    series: [{ data: [10, 22, 35, 48, 55, 62, 70, project.progress], type: 'line', smooth: true, areaStyle: { color: 'rgba(22,119,255,0.1)' }, lineStyle: { color: '#1677ff' } }],
  }

  const handleAddMember = async () => {
    const values = await form.validateFields()
    setMembers((prev) => [...prev, { id: `pm${prev.length + 1}`, ...values }])
    setMemberModalOpen(false)
    form.resetFields()
    message.success('成员已添加')
  }

  const tabItems = [
    {
      key: 'overview',
      label: '项目概览',
      children: (
        <>
          <Descriptions column={2} bordered size="small" style={{ marginBottom: 24 }}>
            <Descriptions.Item label="项目名称">{project.name}</Descriptions.Item>
            <Descriptions.Item label="所属行业">{project.industry}</Descriptions.Item>
            <Descriptions.Item label="项目负责人">{project.manager}</Descriptions.Item>
            <Descriptions.Item label="项目状态"><StatusTag status={project.status} /></Descriptions.Item>
            <Descriptions.Item label="开始时间">{project.startDate}</Descriptions.Item>
            <Descriptions.Item label="结束时间">{project.endDate}</Descriptions.Item>
            {project.appKey && <Descriptions.Item label="AppKey">{project.appKey}</Descriptions.Item>}
            <Descriptions.Item label="项目描述" span={2}>{project.description}</Descriptions.Item>
          </Descriptions>
          <Card title="项目里程碑" bordered={false} style={{ marginBottom: 24, boxShadow: 'var(--shadow-card)' }}>
            <Timeline
              items={projectMilestones.map((m) => ({
                color: milestoneColor[m.status],
                children: (
                  <div>
                    <div style={{ fontWeight: 500 }}>{m.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                      {m.date} · <Tag color={milestoneColor[m.status]}>{milestoneLabel[m.status]}</Tag>
                    </div>
                  </div>
                ),
              }))}
            />
          </Card>
          <Card
            title="项目成员"
            bordered={false}
            style={{ boxShadow: 'var(--shadow-card)' }}
            extra={<Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => setMemberModalOpen(true)}>添加成员</Button>}
          >
            <Table size="small" rowKey="id" dataSource={members} pagination={false} columns={[
              { title: '姓名', dataIndex: 'name' },
              { title: '角色', dataIndex: 'role' },
              { title: '部门', dataIndex: 'department' },
              { title: '邮箱', dataIndex: 'email' },
            ]} />
          </Card>
        </>
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
      <Modal title="添加成员" open={memberModalOpen} onCancel={() => setMemberModalOpen(false)} onOk={handleAddMember}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="role" label="角色" rules={[{ required: true }]}>
            <Select options={['项目经理', '技术负责人', '数据工程师', 'AI 算法工程师', '测试工程师'].map((v) => ({ label: v, value: v }))} />
          </Form.Item>
          <Form.Item name="department" label="部门" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
