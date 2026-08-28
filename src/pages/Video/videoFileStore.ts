const videoUrlMap = new Map<string, string>()

export function setTaskVideoUrl(taskId: string, blobUrl: string): void {
  const existing = videoUrlMap.get(taskId)
  if (existing && existing !== blobUrl) {
    URL.revokeObjectURL(existing)
  }
  videoUrlMap.set(taskId, blobUrl)
}

export function getTaskVideoUrl(taskId: string): string | undefined {
  return videoUrlMap.get(taskId)
}

export function removeTaskVideoUrl(taskId: string): void {
  const url = videoUrlMap.get(taskId)
  if (url) {
    URL.revokeObjectURL(url)
    videoUrlMap.delete(taskId)
  }
}

/** 视频分析页独立上传，不绑定任务 */
let analysisVideoUrl: string | undefined

export function setAnalysisVideoUrl(blobUrl: string): void {
  if (analysisVideoUrl) {
    URL.revokeObjectURL(analysisVideoUrl)
  }
  analysisVideoUrl = blobUrl
}

export function getAnalysisVideoUrl(): string | undefined {
  return analysisVideoUrl
}

export function clearAnalysisVideoUrl(): void {
  if (analysisVideoUrl) {
    URL.revokeObjectURL(analysisVideoUrl)
    analysisVideoUrl = undefined
  }
}
