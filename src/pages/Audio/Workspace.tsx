import { useState, useEffect } from 'react'
import { Card, Tabs, Input, Button, Progress, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import AudioSubNav from './components/AudioSubNav'
import AudioUpload from './components/AudioUpload'
import AudioPlayer from './components/AudioPlayer'
import TrimPanel from './components/TrimPanel'
import { useAudioContext } from './AudioContext'
import {
  setWorkspaceAudioUrl,
  setWorkspaceFileMeta,
  getWorkspaceAudioUrl,
  getWorkspaceFileMeta,
} from './audioFileStore'
import { getAudioMetadata } from '@/utils/audioFile'
import { formatFileSize } from '@/utils/videoFile'
import { delay } from '@/utils/mockApi'
import type { AudioFileMeta } from '@/types'
import styles from './index.module.css'

export default function Workspace() {
  const navigate = useNavigate()
  const { clips, addClip, removeClip, fileMeta, setFileMeta } = useAudioContext()
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | undefined>(() => getWorkspaceAudioUrl())
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [urlInput, setUrlInput] = useState('')

  useEffect(() => {
    const savedMeta = getWorkspaceFileMeta()
    const savedUrl = getWorkspaceAudioUrl()
    if (savedMeta && !fileMeta) setFileMeta(savedMeta)
    if (savedUrl && !audioUrl) setAudioUrl(savedUrl)
  }, [fileMeta, audioUrl, setFileMeta])

  const canProceed = !!(fileMeta || clips.length > 0 || audioUrl)

  const handleFileChange = async (file: File | null) => {
    setAudioFile(file)
    if (!file) {
      setFileMeta(null)
      setWorkspaceFileMeta(null)
      setAudioUrl(undefined)
      return
    }
    setUploading(true)
    setUploadProgress(0)
    for (let i = 0; i <= 100; i += 20) {
      setUploadProgress(i)
      await delay(100)
    }
    const meta = await getAudioMetadata(file)
    const ext = file.name.split('.').pop()?.toUpperCase() ?? 'AUDIO'
    const blobUrl = URL.createObjectURL(file)
    const fm: AudioFileMeta = {
      fileName: file.name,
      format: ext,
      fileSize: formatFileSize(file.size),
      duration: meta.duration,
      durationSec: meta.durationSec,
      sampleRate: '44100 Hz',
      bitrate: '128 kbps',
    }
    setWorkspaceAudioUrl(blobUrl, fm)
    setAudioUrl(blobUrl)
    setFileMeta(fm)
    setUploading(false)
    message.success('音频上传完成')
  }

  const handleUrlLoad = async () => {
    if (!urlInput.trim()) return
    setUploading(true)
    await delay(800)
    setFileMeta({
      fileName: 'remote_audio.mp3',
      format: 'MP3',
      fileSize: '12.5 MB',
      duration: '28:30',
      durationSec: 1710,
      sampleRate: '44100 Hz',
      bitrate: '128 kbps',
    })
    setWorkspaceFileMeta({
      fileName: 'remote_audio.mp3',
      format: 'MP3',
      fileSize: '12.5 MB',
      duration: '28:30',
      durationSec: 1710,
      sampleRate: '44100 Hz',
      bitrate: '128 kbps',
    })
    setUploading(false)
    message.success('URL 音频加载成功')
  }

  const uploadTab = (
    <div>
      <AudioUpload value={audioFile} onChange={handleFileChange} />
      {uploading && <Progress percent={uploadProgress} style={{ marginTop: 12 }} />}
    </div>
  )

  const urlTab = (
    <div style={{ display: 'flex', gap: 8 }}>
      <Input placeholder="https://example.com/audio.mp3" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} />
      <Button type="primary" loading={uploading} onClick={handleUrlLoad}>加载</Button>
    </div>
  )

  return (
    <div>
      <AudioSubNav />
      <PageHeader title="音频工作台" description="上传音频、裁剪片段，为语音转文字做准备" />
      <Card title="音频上传" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
        <Tabs items={[{ key: 'file', label: '本地文件', children: uploadTab }, { key: 'url', label: 'URL 上传', children: urlTab }]} />
        {fileMeta && (
          <div className={styles.metaGrid}>
            <div className={styles.metaItem}><div className={styles.metaLabel}>文件名</div><div className={styles.metaValue}>{fileMeta.fileName}</div></div>
            <div className={styles.metaItem}><div className={styles.metaLabel}>格式</div><div className={styles.metaValue}>{fileMeta.format}</div></div>
            <div className={styles.metaItem}><div className={styles.metaLabel}>大小</div><div className={styles.metaValue}>{fileMeta.fileSize}</div></div>
            <div className={styles.metaItem}><div className={styles.metaLabel}>时长</div><div className={styles.metaValue}>{fileMeta.duration}</div></div>
            <div className={styles.metaItem}><div className={styles.metaLabel}>采样率</div><div className={styles.metaValue}>{fileMeta.sampleRate}</div></div>
            <div className={styles.metaItem}><div className={styles.metaLabel}>比特率</div><div className={styles.metaValue}>{fileMeta.bitrate}</div></div>
          </div>
        )}
        <div style={{ marginTop: 16 }}>
          <AudioPlayer src={audioUrl} fileName={fileMeta?.fileName} />
        </div>
      </Card>
      <Card title="音频裁剪" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
        <TrimPanel durationSec={fileMeta?.durationSec ?? 300} clips={clips} onAddClip={addClip} onRemoveClip={removeClip} />
      </Card>
      <div className={styles.actionRow}>
        <Button type="primary" size="large" disabled={!canProceed} onClick={() => navigate('/audio/transcription')}>
          进入语音转文字
        </Button>
        {!canProceed && (
          <span className={styles.actionHint}>请先上传音频或添加裁剪片段</span>
        )}
        {canProceed && clips.length === 0 && fileMeta && (
          <span className={styles.actionHint}>未裁剪时将使用完整音频</span>
        )}
      </div>
    </div>
  )
}
