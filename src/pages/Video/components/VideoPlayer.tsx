import { Progress } from 'antd'
import { PlayCircleOutlined } from '@ant-design/icons'
import styles from '../index.module.css'

interface VideoPlayerProps {
  src?: string
  fileName?: string
  progress?: number
  showProgress?: boolean
}

export default function VideoPlayer({ src, fileName, progress, showProgress = false }: VideoPlayerProps) {
  if (src) {
    return (
      <div className={styles.videoPlayerReal}>
        <video src={src} controls className={styles.videoElement} />
        {fileName && <div className={styles.videoFileName}>{fileName}</div>}
        {showProgress && progress !== undefined && (
          <div className={styles.playerProgressOverlay}>
            <Progress percent={progress} size="small" strokeColor="#1677ff" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={styles.videoPlayer}>
      <PlayCircleOutlined className={styles.playIcon} />
      <div>{fileName ?? '请上传本地视频'}</div>
      {showProgress && progress !== undefined && (
        <div className={styles.playerProgress}>
          <Progress percent={progress} showInfo={false} strokeColor="#1677ff" />
        </div>
      )}
    </div>
  )
}
