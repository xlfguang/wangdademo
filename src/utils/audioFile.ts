export function formatAudioDuration(seconds: number): string {
  if (!Number.isFinite(seconds)) return '—'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function parseTimeToSec(time: string): number {
  const parts = time.split(':').map(Number)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return Number(time) || 0
}

export function getAudioMetadata(file: File): Promise<{ durationSec: number; duration: string }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const audio = document.createElement('audio')
    audio.preload = 'metadata'
    audio.onloadedmetadata = () => {
      const durationSec = audio.duration
      URL.revokeObjectURL(url)
      resolve({ durationSec, duration: formatAudioDuration(durationSec) })
    }
    audio.onerror = () => {
      URL.revokeObjectURL(url)
      resolve({ durationSec: 0, duration: '—' })
    }
    audio.src = url
  })
}
