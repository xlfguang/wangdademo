import { useState } from 'react'
import { Card, Descriptions, Progress, Button, Result, Modal, Row, Col, Space, message } from 'antd'
import { EyeOutlined, CopyOutlined, BarChartOutlined } from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'
import StatusTag from '@/components/StatusTag'
import VideoPlayer from './components/VideoPlayer'
import { useVideoTasks } from './VideoTaskContext'

export default function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTask, getVideoUrl } = useVideoTasks()
  const task = getTask(id ?? '')
  const [previewOpen, setPreviewOpen] = useState(false)

  const videoUrl = id ? getVideoUrl(id) : undefined

  if (!task) {
    return <Result status="404" title="任务不存在" extra={<Button type="primary" onClick={() => navigate('/video/tasks')}>返回列表</Button>} />
  }

  const handleCopyUrl = () => {
    const url = videoUrl ?? task.outputUrl
    if (!url) {
      message.warning('暂无本地视频，请先上传视频创建任务')
      return
    }
    navigator.clipboard.writeText(url).then(() => message.success('本地预览地址已复制（仅当前浏览器有效）'))
  }

  return (
    <div>
      <Button type="link" onClick={() => navigate('/video/tasks')} style={{ padding: 0, marginBottom: 16 }}>← 返回任务列表</Button>
      <Card title={task.name} bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
        <Descriptions column={3}>
          <Descriptions.Item label="Task ID">{task.taskId}</Descriptions.Item>
          <Descriptions.Item label="视频名称">{task.fileName}</Descriptions.Item>
          <Descriptions.Item label="处理类型">{task.processType}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{task.createdAt}</Descriptions.Item>
          <Descriptions.Item label="当前状态"><StatusTag status={task.status} /></Descriptions.Item>
          <Descriptions.Item label="处理进度"><Progress percent={task.progress} style={{ width: 200 }} /></Descriptions.Item>
        </Descriptions>
      </Card>

      {videoUrl && (
        <Card title="本地视频预览" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <VideoPlayer src={videoUrl} fileName={task.fileName} progress={task.progress} showProgress={task.status === 'running'} />
        </Card>
      )}

      {(task.status === 'completed' || task.originalSize) && (
        <Card title="处理结果" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <Row gutter={[16, 16]}>
            {task.originalSize && <Col span={8}><Descriptions column={1} size="small"><Descriptions.Item label="原始文件大小">{task.originalSize}</Descriptions.Item></Descriptions></Col>}
            {task.outputSize && <Col span={8}><Descriptions column={1} size="small"><Descriptions.Item label="处理后文件大小">{task.outputSize}</Descriptions.Item></Descriptions></Col>}
            {task.duration && <Col span={8}><Descriptions column={1} size="small"><Descriptions.Item label="视频时长">{task.duration}</Descriptions.Item></Descriptions></Col>}
            {task.resolution && <Col span={8}><Descriptions column={1} size="small"><Descriptions.Item label="分辨率">{task.resolution}</Descriptions.Item></Descriptions></Col>}
            {task.fps && <Col span={8}><Descriptions column={1} size="small"><Descriptions.Item label="帧率">{task.fps} fps</Descriptions.Item></Descriptions></Col>}
            {task.outputFormat && <Col span={8}><Descriptions column={1} size="small"><Descriptions.Item label="输出格式">{task.outputFormat}</Descriptions.Item></Descriptions></Col>}
          </Row>
        </Card>
      )}

      <Space>
        <Button icon={<EyeOutlined />} onClick={() => setPreviewOpen(true)} disabled={!videoUrl}>预览</Button>
        <Button icon={<BarChartOutlined />} onClick={() => navigate('/video/analysis')}>查看分析结果</Button>
        <Button icon={<CopyOutlined />} onClick={handleCopyUrl} disabled={!videoUrl}>复制本地地址</Button>
      </Space>

      <Modal
        title="视频预览"
        open={previewOpen}
        onCancel={() => setPreviewOpen(false)}
        footer={null}
        width={720}
      >
        <VideoPlayer src={videoUrl} fileName={task.fileName} progress={task.progress} showProgress={task.status === 'running'} />
      </Modal>
    </div>
  )
}
