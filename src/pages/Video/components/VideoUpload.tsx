import { Upload, Button, Typography, message } from 'antd'
import { VideoCameraOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { formatFileSize } from '@/utils/videoFile'

const { Text } = Typography

interface VideoUploadProps {
  value?: File | null
  onChange?: (file: File | null) => void
  maxSizeMB?: number
}

export default function VideoUpload({ value, onChange, maxSizeMB = 500 }: VideoUploadProps) {
  const uploadProps: UploadProps = {
    accept: 'video/*,.mp4,.mov,.avi,.webm,.mkv,.m4v',
    maxCount: 1,
    showUploadList: false,
    beforeUpload: (file) => {
      const isVideo = file.type.startsWith('video/') || /\.(mp4|mov|avi|webm|mkv|m4v)$/i.test(file.name)
      if (!isVideo) {
        message.error('请上传视频文件')
        return Upload.LIST_IGNORE
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        message.error(`文件大小不能超过 ${maxSizeMB} MB`)
        return Upload.LIST_IGNORE
      }
      onChange?.(file)
      return false
    },
  }

  if (value) {
    return (
      <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: 8, border: '1px dashed #d9d9d9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <VideoCameraOutlined style={{ fontSize: 24, color: '#1677ff' }} />
            <div>
              <Text strong>{value.name}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>{formatFileSize(value.size)} · 本地文件，未上传服务器</Text>
            </div>
          </div>
          <Button size="small" onClick={() => onChange?.(null)}>更换</Button>
        </div>
      </div>
    )
  }

  return (
    <Upload.Dragger {...uploadProps} style={{ padding: '12px 0' }}>
      <p className="ant-upload-drag-icon">
        <VideoCameraOutlined style={{ fontSize: 36, color: '#1677ff' }} />
      </p>
      <p className="ant-upload-text">点击或拖拽视频文件到此处</p>
      <p className="ant-upload-hint">支持 MP4、MOV、AVI、WebM 等，仅本地预览，不上传 OSS</p>
    </Upload.Dragger>
  )
}
