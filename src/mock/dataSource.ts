// 数据源适配层（Data Source Adapter）
// ─────────────────────────────────────────────
// 本地数据源：src/mock/data/*.json（打包内嵌，页面同步读取，作为兜底）。
// 远程数据源：后端 JSON 文件读写接口
//   GET  /api/file/read?filename=<文件名>
//   POST /api/file/write  { filename, content }
// 后端基地址：
//   开发环境（import.meta.env.DEV）走相对路径 /api/...，由 vite.config.ts 代理转发到后端（避免跨域）。
//   生产环境使用 http://192.168.2.48:22301。
//   也可通过环境变量 VITE_API_BASE_URL 覆盖（设为空字符串即走相对路径）。
// ─────────────────────────────────────────────
import dashboard from './data/dashboard.json'
import video from './data/video.json'
import data from './data/data.json'
import audio from './data/audio.json'
import crawler from './data/crawler.json'
import community from './data/community.json'
import dataClean from './data/dataClean.json'
import knowledge from './data/knowledge.json'
import task from './data/task.json'
import model from './data/model.json'
import project from './data/project.json'

/** 左侧菜单对应的数据键（每个菜单一个 JSON 文件） */
export type MockMenuKey =
  | 'dashboard'
  | 'video'
  | 'data'
  | 'audio'
  | 'crawler'
  | 'community'
  | 'dataClean'
  | 'knowledge'
  | 'task'
  | 'model'
  | 'project'

/** 本地 JSON 注册表：菜单键 -> 打包的数据对象 */
const localRegistry: Record<MockMenuKey, unknown> = {
  dashboard,
  video,
  data,
  audio,
  crawler,
  community,
  dataClean,
  knowledge,
  task,
  model,
  project,
}

/** 后端基地址（可用环境变量 VITE_API_BASE_URL 覆盖；开发环境默认走相对路径 /api 代理） */
const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, '') ??
  (import.meta.env.DEV ? '' : 'http://192.168.2.48:22301')

/** 同步读取本地打包 JSON（无网络时的兜底数据源）。 */
export function getLocalData<T = unknown>(key: MockMenuKey): T {
  return localRegistry[key] as T
}

/** 解析后端返回：可能是原始 JSON 字符串，也可能是被 JSON 编码过的字符串。 */
async function parseFileContent<T = unknown>(res: Response): Promise<T> {
  const text = await res.text()
  try {
    const first = JSON.parse(text)
    if (typeof first === 'string') {
      return JSON.parse(first) as T
    }
    return first as T
  } catch {
    return text as unknown as T
  }
}

/** 从后端读取任意 JSON 文件（支持子目录，例如 config/app.json）。 */
export async function readRemoteFile<T = unknown>(
  filename: string,
  signal?: AbortSignal,
): Promise<T> {
  const res = await fetch(
    `${API_BASE}/api/file/read?filename=${encodeURIComponent(filename)}`,
    { signal },
  )
  if (!res.ok) {
    throw new Error(`[dataSource] 读取远程文件失败：${filename}（HTTP ${res.status}）`)
  }
  return parseFileContent<T>(res)
}

/** 从后端读取某个菜单的 JSON 数据（文件名 = <menu>.json）。 */
export function getRemoteData<T = unknown>(
  key: MockMenuKey,
  signal?: AbortSignal,
): Promise<T> {
  return readRemoteFile<T>(`${key}.json`, signal)
}

/** 覆盖写回后端某个 JSON 文件；content 传对象或 JSON 字符串均可。 */
export async function writeRemoteFile(filename: string, content: unknown): Promise<void> {
  const res = await fetch(`${API_BASE}/api/file/write`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename,
      content: typeof content === 'string' ? content : JSON.stringify(content),
    }),
  })
  if (!res.ok) {
    throw new Error(`[dataSource] 写入远程文件失败：${filename}（HTTP ${res.status}）`)
  }
}

/** 覆盖写回某个菜单的 JSON 数据（文件名 = <menu>.json）。 */
export function writeMenuData(key: MockMenuKey, content: unknown): Promise<void> {
  return writeRemoteFile(`${key}.json`, content)
}

/** 读最新数据 → 用 updater 修改 → 写回后端，返回新数据。 */
export async function updateMenuData<T>(key: MockMenuKey, updater: (data: T) => T): Promise<T> {
  const current = await getMenuData<T>(key)
  const next = updater(current)
  await writeMenuData(key, next)
  return next
}

/**
 * 写回后端（fire-and-forget）：增删改后调用，失败仅告警，不影响页面交互。
 * 传整个菜单数据对象（其它字段保持不变）。
 */
export function persistMenuData(key: MockMenuKey, data: unknown): void {
  void writeMenuData(key, data).catch((err) => {
    console.warn(`[dataSource] 菜单数据写回失败：${key}`, err)
  })
}

const updateQueues: Record<string, Promise<unknown>> = {}

/**
 * 串行化的「读→改→写」：按菜单 key 排队执行，避免连续多次增删改时并发写互相覆盖。
 * updater 接收后端最新数据，返回修改后的完整菜单数据。
 */
export function persistMenuUpdate<T>(key: MockMenuKey, updater: (data: T) => T): void {
  const run = async (): Promise<void> => {
    const current = await getMenuData<T>(key)
    const next = updater(current)
    await writeMenuData(key, next)
  }
  const prev = (updateQueues[key] ?? Promise.resolve()) as Promise<unknown>
  updateQueues[key] = prev.then(run).catch((err) => {
    console.warn(`[dataSource] 菜单数据写回失败：${key}`, err)
  })
}

/**
 * 统一的数据入口：优先从后端读取，失败回退本地。
 */
export async function getMenuData<T = unknown>(key: MockMenuKey): Promise<T> {
  try {
    return await getRemoteData<T>(key)
  } catch (err) {
    console.warn('[dataSource] 远程数据获取失败，回退本地：', err)
  }
  return getLocalData<T>(key)
}
