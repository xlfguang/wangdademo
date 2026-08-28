import { useState, useEffect } from 'react'
import { Drawer, Form, Input, Select, InputNumber, Checkbox, Button, message } from 'antd'
import type { VideoTask } from '@/types'
import { VIDEO_PROCESS_TYPES } from '@/types'
import { delay, generateId } from '@/utils/mockApi'
import { formatFileSize, getVideoMetadata, createLocalVideoUrl } from '@/utils/videoFile'
import { generateTaskId } from '@/mock/video'
import { setTaskVideoUrl } from '../videoFileStore'
import { useVideoTasks } from '../VideoTaskContext'
import VideoUpload from './VideoUpload'

interface CreateTaskDrawerProps {
  open: boolean
  onClose: () => void
  initialProcessType?: string
}

const processTypeOptions = VIDEO_PROCESS_TYPES.map((v) => ({ label: v, value: v }))

export default function CreateTaskDrawer({ open, onClose, initialProcessType }: CreateTaskDrawerProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [processType, setProcessType] = useState<string>('视频转码')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const { addTask } = useVideoTasks()

  useEffect(() => {
    if (open && initialProcessType) {
      setProcessType(initialProcessType)
    }
  }, [open, initialProcessType])

  const handleClose = () => {
    setVideoFile(null)
    form.resetFields()
    setProcessType('视频转码')
    onClose()
  }

  const handleSubmit = async () => {
    if (!videoFile) {
      message.warning('请先上传本地视频文件')
      return
    }
    const values = await form.validateFields()
    setLoading(true)
    await delay(500)

    const metadata = await getVideoMetadata(videoFile)
    const taskId = generateId()
    const blobUrl = createLocalVideoUrl(videoFile)
    setTaskVideoUrl(taskId, blobUrl)

    const now = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')

    const newTask: VideoTask = {
      id: taskId,
      taskId: generateTaskId(),
      name: values.name ?? `${processType} - ${videoFile.name}`,
      fileName: videoFile.name,
      processType,
      progress: 0,
      status: 'running',
      createdAt: now,
      updatedAt: now,
      originalSize: formatFileSize(videoFile.size),
      duration: metadata.duration,
      resolution: metadata.resolution ?? values.resolution ?? '1920x1080',
      fps: String(values.fps ?? 30),
      localVideoUrl: blobUrl,
    }

    addTask(newTask)
    setLoading(false)
    handleClose()
    message.success('任务创建成功，正在处理中')
  }

  const renderDynamicFields = () => {
    switch (processType) {
      case '视频剪辑':
        return (
          <>
            <Form.Item name="startTime" label="开始时间" rules={[{ required: true }]}>
              <Input placeholder="00:00:00" />
            </Form.Item>
            <Form.Item name="endTime" label="结束时间" rules={[{ required: true }]}>
              <Input placeholder="00:05:30" />
            </Form.Item>
          </>
        )
      case '视频转码':
        return (
          <>
            <Form.Item name="targetFormat" label="目标格式" initialValue="mp4">
              <Select options={['mp4', 'mov', 'webm', 'avi'].map((v) => ({ label: v.toUpperCase(), value: v }))} />
            </Form.Item>
            <Form.Item name="resolution" label="分辨率" initialValue="1920x1080">
              <Select options={['1920x1080', '1280x720', '3840x2160'].map((v) => ({ label: v, value: v }))} />
            </Form.Item>
            <Form.Item name="fps" label="帧率" initialValue={30}>
              <InputNumber min={1} max={120} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="codec" label="编码方式" initialValue="h264">
              <Select options={[{ label: 'H.264', value: 'h264' }, { label: 'H.265', value: 'h265' }]} />
            </Form.Item>
          </>
        )
      case '视频压缩':
        return (
          <>
            <Form.Item name="quality" label="压缩质量" initialValue={80}>
              <InputNumber min={1} max={100} style={{ width: '100%' }} addonAfter="%" />
            </Form.Item>
            <Form.Item name="targetSize" label="目标文件大小 (MB)" initialValue={100}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </>
        )
      case '全量分析':
      case 'AI视频摘要':
        return (
          <Form.Item name="analysisOptions" label="分析选项" initialValue={['keyframes', 'ocr', 'speech', 'summary', 'keywords']}>
            <Checkbox.Group options={[
              { label: '关键帧', value: 'keyframes' },
              { label: 'OCR', value: 'ocr' },
              { label: '语音', value: 'speech' },
              { label: '摘要', value: 'summary' },
              { label: '关键词', value: 'keywords' },
            ]} />
          </Form.Item>
        )
      default:
        return null
    }
  }

  return (
    <Drawer
      title="创建视频处理任务"
      open={open}
      onClose={handleClose}
      width={480}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={handleClose} style={{ marginRight: 8 }}>取消</Button>
          <Button type="primary" loading={loading} onClick={handleSubmit}>开始处理</Button>
        </div>
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="任务名称">
          <Input placeholder="可选，默认自动生成" />
        </Form.Item>
        <Form.Item label="处理类型" required>
          <Select
            value={processType}
            options={processTypeOptions}
            onChange={(v) => setProcessType(v)}
          />
        </Form.Item>
        <Form.Item label="上传视频" required>
          <VideoUpload value={videoFile} onChange={setVideoFile} />
        </Form.Item>
        {renderDynamicFields()}
      </Form>
    </Drawer>
  )
}
