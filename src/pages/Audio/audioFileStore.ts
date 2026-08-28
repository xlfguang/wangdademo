import type { AudioFileMeta } from '@/types'

let workspaceAudioUrl: string | undefined
let workspaceFileMeta: AudioFileMeta | null = null

export function setWorkspaceAudioUrl(url: string, meta?: AudioFileMeta): void {
  if (workspaceAudioUrl) URL.revokeObjectURL(workspaceAudioUrl)
  workspaceAudioUrl = url
  if (meta) workspaceFileMeta = meta
}

export function getWorkspaceAudioUrl(): string | undefined {
  return workspaceAudioUrl
}

export function getWorkspaceFileMeta(): AudioFileMeta | null {
  return workspaceFileMeta
}

export function setWorkspaceFileMeta(meta: AudioFileMeta | null): void {
  workspaceFileMeta = meta
}

export function clearWorkspaceAudioUrl(): void {
  if (workspaceAudioUrl) {
    URL.revokeObjectURL(workspaceAudioUrl)
    workspaceAudioUrl = undefined
  }
  workspaceFileMeta = null
}
