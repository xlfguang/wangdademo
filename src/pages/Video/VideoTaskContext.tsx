import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import type { VideoTask } from '@/types'
import { useMenuData } from '@/mock/useMenuData'
import { persistMenuUpdate } from '@/mock/dataSource'
import type { VideoData } from '@/mock/video'
import { getTaskVideoUrl } from './videoFileStore'

interface VideoTaskContextValue {
  tasks: VideoTask[]
  addTask: (task: VideoTask) => void
  updateTask: (id: string, updates: Partial<VideoTask>) => void
  cancelTask: (id: string) => void
  retryTask: (id: string) => void
  getTask: (id: string) => VideoTask | undefined
  getVideoUrl: (id: string) => string | undefined
}

const VideoTaskContext = createContext<VideoTaskContextValue | null>(null)

export function VideoTaskProvider({ children }: { children: ReactNode }) {
  const { data } = useMenuData<VideoData>('video')
  const [tasks, setTasksState] = useState<VideoTask[]>(data.videoTasks)
  const progressTimers = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map())

  useEffect(() => {
    setTasksState(data.videoTasks)
  }, [data])

  useEffect(() => {
    return () => {
      progressTimers.current.forEach((timer) => clearInterval(timer))
    }
  }, [])

  const startProgressSimulation = useCallback((taskId: string) => {
    if (progressTimers.current.has(taskId)) return

    const timer = setInterval(() => {
      setTasksState((prev) =>
        prev.map((t) => {
          if (t.id !== taskId || t.status !== 'running') return t
          const newProgress = Math.min(t.progress + Math.floor(Math.random() * 15) + 5, 100)
          if (newProgress >= 100) {
            clearInterval(progressTimers.current.get(taskId)!)
            progressTimers.current.delete(taskId)
            return {
              ...t,
              progress: 100,
              status: 'completed' as const,
              updatedAt: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
              outputSize: t.originalSize ? t.originalSize : '320 MB',
              outputFormat: 'MP4',
              outputUrl: t.localVideoUrl ?? getTaskVideoUrl(t.id),
            }
          }
          return { ...t, progress: newProgress, updatedAt: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-') }
        }),
      )
    }, 1000)

    progressTimers.current.set(taskId, timer)
  }, [])

  const addTask = useCallback(
    (task: VideoTask) => {
      setTasksState((prev) => [task, ...prev])
      persistMenuUpdate<VideoData>('video', (d) => ({ ...d, videoTasks: [task, ...d.videoTasks] }))
      if (task.status === 'running') {
        startProgressSimulation(task.id)
      }
    },
    [startProgressSimulation],
  )

  const updateTask = useCallback((id: string, updates: Partial<VideoTask>) => {
    setTasksState((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)))
    persistMenuUpdate<VideoData>('video', (d) => ({ ...d, videoTasks: d.videoTasks.map((t) => (t.id === id ? { ...t, ...updates } : t)) }))
  }, [])

  const cancelTask = useCallback((id: string) => {
    const timer = progressTimers.current.get(id)
    if (timer) {
      clearInterval(timer)
      progressTimers.current.delete(id)
    }
    updateTask(id, {
      status: 'failed',
      updatedAt: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
    })
  }, [updateTask])

  const retryTask = useCallback(
    (id: string) => {
      updateTask(id, {
        status: 'running',
        progress: 0,
        updatedAt: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
      })
      startProgressSimulation(id)
    },
    [updateTask, startProgressSimulation],
  )

  const getTask = useCallback(
    (id: string) => tasks.find((t) => t.id === id) ?? data.videoTasks.find((t) => t.id === id),
    [tasks],
  )

  const getVideoUrl = useCallback(
    (id: string) => {
      const task = tasks.find((t) => t.id === id) ?? data.videoTasks.find((t) => t.id === id)
      return task?.localVideoUrl ?? task?.outputUrl ?? getTaskVideoUrl(id)
    },
    [tasks],
  )

  return (
    <VideoTaskContext.Provider value={{ tasks, addTask, updateTask, cancelTask, retryTask, getTask, getVideoUrl }}>
      {children}
    </VideoTaskContext.Provider>
  )
}

export function useVideoTasks(): VideoTaskContextValue {
  const ctx = useContext(VideoTaskContext)
  if (!ctx) throw new Error('useVideoTasks must be used within VideoTaskProvider')
  return ctx
}
