import { useState } from 'react'
import { Row, Col, Card, Button, Slider, Select, Input, Progress, message, Space, Tag, Modal, Form, Radio, InputNumber } from 'antd'
import {
  UndoOutlined, RedoOutlined, SaveOutlined, ExportOutlined,
  ScissorOutlined, SplitCellsOutlined, MergeCellsOutlined,
} from '@ant-design/icons'
import PageHeader from '@/components/PageHeader'
import VideoSubNav from './components/VideoSubNav'
import VideoPlayer from './components/VideoPlayer'
import VideoUpload from './components/VideoUpload'
import { workspaceAssets, workspaceTimelineClips } from '@/mock/video'
import { delay } from '@/utils/mockApi'
import styles from './index.module.css'

const tools = [
  { key: 'trim', icon: <ScissorOutlined />, label: '裁剪' },
  { key: 'split', icon: <SplitCellsOutlined />, label: '分割' },
  { key: 'merge', icon: <MergeCellsOutlined />, label: '拼接' },
]

const resolutionLabel = (value: number) => {
  if (value >= 80) return '1080P (1920×1080)'
  if (value >= 50) return '720P (1280×720)'
  return '480P (854×480)'
}

export default function VideoWorkspace() {
  const [selectedAsset, setSelectedAsset] = useState(workspaceAssets[0].id)
  const [selectedClip, setSelectedClip] = useState(workspaceTimelineClips[0].id)
  const [activeTool, setActiveTool] = useState('trim')
  const [inPoint, setInPoint] = useState('00:00:05')
  const [outPoint, setOutPoint] = useState('00:05:30')
  const [format, setFormat] = useState('mp4')
  const [resolution, setResolution] = useState(80)
  const [exporting, setExporting] = useState(false)
  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [exportForm] = Form.useForm()

  const asset = workspaceAssets.find((a) => a.id === selectedAsset) ?? workspaceAssets[0]
  const videoClips = workspaceTimelineClips.filter((c) => c.track === 'video')
  const audioClips = workspaceTimelineClips.filter((c) => c.track === 'audio')

  const handleApply = () => {
    message.success(`${tools.find((t) => t.key === activeTool)?.label ?? '操作'}已应用到选中片段`)
  }

  const openExportModal = () => {
    exportForm.setFieldsValue({
      format,
      resolution,
      frameRate: 30,
      codec: 'h264',
      bitrate: 8,
      audioCodec: 'aac',
      includeSubtitles: true,
      fileName: (videoFile?.name ?? asset.name).replace(/\.[^.]+$/, ''),
    })
    setExportModalOpen(true)
  }

  const handleExportConfirm = async () => {
    const values = await exportForm.validateFields()
    setExportModalOpen(false)
    setExporting(true)
    setExportProgress(0)
    for (let i = 0; i <= 100; i += 20) {
      setExportProgress(i)
      await delay(250)
    }
    setExporting(false)
    setExportProgress(0)
    message.success(
      `导出任务已提交：${values.fileName}.${values.format} · ${resolutionLabel(values.resolution)} · ${values.frameRate}fps`,
    )
  }

  const renderTrack = (trackClips: typeof workspaceTimelineClips, trackLabel: string) => (
    <div className={styles.timelineTrack}>
      <div className={styles.trackLabel}>{trackLabel}</div>
      <div className={styles.trackLane}>
        {trackClips.map((clip) => (
          <div
            key={clip.id}
            className={`${styles.timelineClip} ${selectedClip === clip.id ? styles.timelineClipActive : ''}`}
            style={{ left: `${clip.start}%`, width: `${clip.end - clip.start}%`, background: clip.color }}
            onClick={() => setSelectedClip(clip.id)}
          >
            <span>{clip.label}</span>
            {selectedClip === clip.id && (
              <>
                <div className={styles.trimHandleLeft} />
                <div className={styles.trimHandleRight} />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div>
      <VideoSubNav />
      <PageHeader
        title="视频工作台"
        description="可视化剪辑、分割与转码 — 拖拽时间轴操作（演示模式）"
        extra={
          <Space>
            <Button icon={<UndoOutlined />} disabled>撤销</Button>
            <Button icon={<RedoOutlined />} disabled>重做</Button>
            <Button icon={<SaveOutlined />} onClick={() => message.success('草稿已保存')}>保存草稿</Button>
            <Button type="primary" icon={<ExportOutlined />} loading={exporting} onClick={openExportModal}>导出</Button>
          </Space>
        }
      />
      {exporting && <Progress percent={exportProgress} status="active" style={{ marginBottom: 12 }} />}
      <Modal
        title="导出视频"
        open={exportModalOpen}
        onCancel={() => setExportModalOpen(false)}
        onOk={handleExportConfirm}
        okText="开始导出"
        cancelText="取消"
        width={520}
        destroyOnClose
      >
        <Form form={exportForm} layout="vertical" initialValues={{ format: 'mp4', resolution: 80, frameRate: 30, codec: 'h264', bitrate: 8, audioCodec: 'aac', includeSubtitles: true }}>
          <Form.Item name="fileName" label="文件名" rules={[{ required: true, message: '请输入文件名' }]}>
            <Input placeholder="导出文件名（不含扩展名）" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="format" label="导出格式" rules={[{ required: true }]}>
                <Select options={[
                  { label: 'MP4 (H.264)', value: 'mp4' },
                  { label: 'MOV (QuickTime)', value: 'mov' },
                  { label: 'WebM (VP9)', value: 'webm' },
                  { label: 'AVI', value: 'avi' },
                ]} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="frameRate" label="帧率" rules={[{ required: true }]}>
                <Select options={[
                  { label: '24 fps（电影）', value: 24 },
                  { label: '25 fps（PAL）', value: 25 },
                  { label: '30 fps（标准）', value: 30 },
                  { label: '60 fps（高帧率）', value: 60 },
                ]} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="resolution" label="分辨率">
            <Slider
              min={20}
              max={100}
              marks={{ 20: '480P', 50: '720P', 80: '1080P', 100: '4K' }}
              tooltip={{ formatter: (v) => resolutionLabel(v ?? 80) }}
            />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="codec" label="视频编码">
                <Select options={[
                  { label: 'H.264', value: 'h264' },
                  { label: 'H.265 / HEVC', value: 'h265' },
                  { label: 'VP9', value: 'vp9' },
                ]} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="bitrate" label="码率 (Mbps)">
                <InputNumber min={1} max={50} step={0.5} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="audioCodec" label="音频编码">
                <Select options={[
                  { label: 'AAC', value: 'aac' },
                  { label: 'MP3', value: 'mp3' },
                  { label: 'PCM', value: 'pcm' },
                ]} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="includeSubtitles" label="字幕">
                <Radio.Group options={[
                  { label: '包含字幕轨', value: true },
                  { label: '不含字幕', value: false },
                ]} optionType="button" buttonStyle="solid" size="small" />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: 8, fontSize: 13, color: 'var(--color-text-secondary)' }}>
            导出范围：入点 {inPoint} — 出点 {outPoint} · 素材 {videoFile?.name ?? asset.name}
          </div>
        </Form>
      </Modal>
      <Row gutter={16}>
        <Col span={5}>
          <Card title="素材库" size="small" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
            <VideoUpload value={videoFile} onChange={setVideoFile} />
            <div style={{ marginTop: 12 }}>
              {workspaceAssets.map((a) => (
                <div
                  key={a.id}
                  className={`${styles.assetItem} ${selectedAsset === a.id ? styles.assetItemActive : ''}`}
                  onClick={() => setSelectedAsset(a.id)}
                >
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{a.duration} · {a.size}</div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col span={13}>
          <Card bordered={false} style={{ boxShadow: 'var(--shadow-card)', marginBottom: 12 }}>
            <VideoPlayer fileName={videoFile?.name ?? asset.name} />
            <div className={styles.timecodeBar}>
              <span>入点 {inPoint}</span>
              <Tag color="blue">播放头 00:02:18 / {asset.duration}</Tag>
              <span>出点 {outPoint}</span>
            </div>
          </Card>
          <Card title="时间轴" size="small" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
            <div className={styles.timelineRuler}>
              {['00:00', '01:00', '02:00', '03:00', '04:00', '05:00'].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            {renderTrack(videoClips, '视频')}
            {renderTrack(audioClips, '音频')}
          </Card>
        </Col>
        <Col span={6}>
          <Card title="编辑工具" size="small" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
            <Space wrap style={{ marginBottom: 16 }}>
              {tools.map((t) => (
                <Button
                  key={t.key}
                  type={activeTool === t.key ? 'primary' : 'default'}
                  icon={t.icon}
                  size="small"
                  onClick={() => setActiveTool(t.key)}
                >
                  {t.label}
                </Button>
              ))}
            </Space>
            {activeTool === 'trim' && (
              <>
                <div style={{ marginBottom: 8 }}><label>入点</label><Input value={inPoint} onChange={(e) => setInPoint(e.target.value)} style={{ marginTop: 4 }} /></div>
                <div style={{ marginBottom: 8 }}><label>出点</label><Input value={outPoint} onChange={(e) => setOutPoint(e.target.value)} style={{ marginTop: 4 }} /></div>
              </>
            )}
            {(activeTool === 'split' || activeTool === 'merge') && (
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
                选中时间轴片段后，点击「应用」{activeTool === 'split' ? '在当前播放头位置分割' : '与相邻片段合并'}。
              </p>
            )}
            <div style={{ marginTop: 16 }}>
              <div style={{ marginBottom: 8 }}>目标格式</div>
              <Select value={format} onChange={setFormat} style={{ width: '100%' }} options={['mp4', 'mov', 'webm'].map((v) => ({ label: v.toUpperCase(), value: v }))} />
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ marginBottom: 8 }}>分辨率 {resolution >= 80 ? '1080P' : resolution >= 50 ? '720P' : '480P'}</div>
              <Slider min={20} max={100} value={resolution} onChange={setResolution} />
            </div>
            <Button type="primary" block style={{ marginTop: 16 }} onClick={handleApply}>应用</Button>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
