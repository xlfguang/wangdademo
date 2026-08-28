import styles from '../index.module.css'

interface AudioPlayerProps {
  src?: string
  fileName?: string
}

export default function AudioPlayer({ src, fileName }: AudioPlayerProps) {
  if (src) {
    return (
      <div className={styles.audioPlayerReal}>
        <audio src={src} controls className={styles.audioElement} />
        {fileName && <div className={styles.audioFileName}>{fileName}</div>}
      </div>
    )
  }
  return (
    <div className={styles.audioPlayerPlaceholder}>
      <AudioOutlinedIcon />
      <div>{fileName ?? '请上传本地音频'}</div>
    </div>
  )
}

function AudioOutlinedIcon() {
  return (
    <svg viewBox="0 0 24 24" width="48" height="48" fill="rgba(255,255,255,0.6)">
      <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
    </svg>
  )
}
