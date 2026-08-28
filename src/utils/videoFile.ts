export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds)) return '—'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function getVideoMetadata(file: File): Promise<{ duration: string; resolution?: string }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      const duration = formatDuration(video.duration)
      const resolution =
        video.videoWidth && video.videoHeight
          ? `${video.videoWidth}x${video.videoHeight}`
          : undefined
      URL.revokeObjectURL(url)
      resolve({ duration, resolution })
    }
    video.onerror = () => {
      URL.revokeObjectURL(url)
      resolve({ duration: '—' })
    }
    video.src = url
  })
}

export function createLocalVideoUrl(file: File): string {
  return URL.createObjectURL(file)
}
