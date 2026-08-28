import { Upload, Button, Typography, message } from 'antd'
import { AudioOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { formatFileSize } from '@/utils/videoFile'

const { Text } = Typography

interface AudioUploadProps {
  value?: File | null
  onChange?: (file: File | null) => void
  maxSizeMB?: number
}

export default function AudioUpload({ value, onChange, maxSizeMB = 200 }: AudioUploadProps) {
  const uploadProps: UploadProps = {
    accept: 'audio/*,.wav,.mp3,.mpeg',
    maxCount: 1,
    showUploadList: false,
    beforeUpload: (file) => {
      const isAudio = file.type.startsWith('audio/') || /\.(wav|mp3|mpeg)$/i.test(file.name)
      if (!isAudio) {
        message.error('当前文件格式不支持，请上传 WAV 或 MP3 格式文件')
        return Upload.LIST_IGNORE
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        message.error(`文件大小超过 ${maxSizeMB}MB，请压缩后重新上传`)
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
            <AudioOutlined style={{ fontSize: 24, color: '#1677ff' }} />
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
      <p className="ant-upload-drag-icon"><AudioOutlined style={{ fontSize: 36, color: '#1677ff' }} /></p>
      <p className="ant-upload-text">点击或拖拽音频文件到此处</p>
      <p className="ant-upload-hint">支持 WAV、MP3，最大 200MB，仅本地预览</p>
    </Upload.Dragger>
  )
}
