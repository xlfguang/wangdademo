import { useState } from 'react'
import { Row, Col, Card, Tag, Timeline, Tabs, message } from 'antd'
import VideoSubNav from './components/VideoSubNav'
import VideoUpload from './components/VideoUpload'
import VideoPlayer from './components/VideoPlayer'
import { videoAnalysis } from '@/mock/video'
import { createLocalVideoUrl } from '@/utils/videoFile'
import { setAnalysisVideoUrl, getAnalysisVideoUrl } from './videoFileStore'
import styles from './index.module.css'

export default function Analysis() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | undefined>(() => getAnalysisVideoUrl())

  const handleVideoChange = (file: File | null) => {
    setVideoFile(file)
    if (file) {
      const url = createLocalVideoUrl(file)
      setAnalysisVideoUrl(url)
      setVideoUrl(url)
      message.success(`已加载本地视频：${file.name}`)
    } else {
      setVideoUrl(undefined)
    }
  }

  const tabItems = [
    {
      key: 'ocr',
      label: 'OCR 文字',
      children: (
        <Timeline
          items={videoAnalysis.ocrSegments.map((seg) => ({
            children: (
              <div>
                <Tag color="blue" style={{ marginBottom: 4 }}>{seg.timestamp}</Tag>
                <div>{seg.text}</div>
              </div>
            ),
          }))}
        />
      ),
    },
    {
      key: 'speech',
      label: '语音转写',
      children: (
        <Timeline
          items={videoAnalysis.speechSegments.map((seg) => ({
            children: (
              <div>
                <Tag color="green" style={{ marginBottom: 4 }}>{seg.timestamp}</Tag>
                <div>{seg.text}</div>
              </div>
            ),
          }))}
        />
      ),
    },
  ]

  return (
    <div>
      <VideoSubNav />
      <Row gutter={16}>
        <Col span={14}>
          <Card title="视频播放器" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
            <div style={{ marginBottom: 16 }}>
              <VideoUpload value={videoFile} onChange={handleVideoChange} />
            </div>
            <VideoPlayer
              src={videoUrl}
              fileName={videoFile?.name ?? (videoUrl ? '本地视频' : undefined)}
            />
          </Card>

          <Card title="关键帧" bordered={false} style={{ marginTop: 16, boxShadow: 'var(--shadow-card)' }}>
            <Row gutter={[12, 12]}>
              {videoAnalysis.keyFrames.map((kf) => (
                <Col span={6} key={kf.id}>
                  <div className={styles.keyFrameCard}>
                    <div className={styles.keyFrameImage}>{kf.timestamp}</div>
                    <div className={styles.keyFrameInfo}>
                      <div>时间戳: {kf.timestamp}</div>
                      <div>清晰度: {kf.clarity}%</div>
                      <div>相似度: {kf.similarity}%</div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        <Col span={10}>
          <Card title="AI 分析结果" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
            {!videoUrl && (
              <div style={{ padding: '12px 0', color: 'var(--color-text-secondary)', fontSize: 13, marginBottom: 12 }}>
                上传本地视频后，下方为 AI 分析结果
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>视频摘要</div>
              <div className={styles.summaryBlock}>{videoAnalysis.summary}</div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>关键词</div>
              <div>
                {videoAnalysis.keywords.map((kw) => (
                  <Tag key={kw} color="blue" style={{ marginBottom: 4 }}>{kw}</Tag>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>场景分析</div>
              <Timeline
                items={videoAnalysis.scenes.map((scene) => ({
                  children: (
                    <div>
                      <Tag>{scene.timeRange}</Tag>
                      <span style={{ marginLeft: 8 }}>{scene.label}</span>
                    </div>
                  ),
                }))}
              />
            </div>

            <Tabs items={tabItems} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
