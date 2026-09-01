import { Card, Descriptions, Progress, Button, Result } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import StatusTag from '@/components/StatusTag'
import { useMenuData } from '@/mock/useMenuData'
import type { DataMenuData } from '@/mock/data'

export default function DataTaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data } = useMenuData<DataMenuData>('data')
  const task = data.dataTasks.find((t) => t.id === id)

  if (!task) {
    return <Result status="404" title="任务不存在" extra={<Button type="primary" onClick={() => navigate('/data/overview')}>返回概览</Button>} />
  }

  return (
    <div>
      <Button type="link" onClick={() => navigate('/data/governance')} style={{ padding: 0, marginBottom: 16 }}>← 返回数据治理</Button>
      <Card title={task.name} bordered={false}>
        <Descriptions column={2}>
          <Descriptions.Item label="数据源">{task.dataSource}</Descriptions.Item>
          <Descriptions.Item label="数据量">{task.dataVolume}</Descriptions.Item>
          <Descriptions.Item label="状态"><StatusTag status={task.status} /></Descriptions.Item>
          <Descriptions.Item label="处理进度"><Progress percent={task.progress} style={{ width: 200 }} /></Descriptions.Item>
          <Descriptions.Item label="创建时间">{task.createdAt}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{task.updatedAt}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  )
}
