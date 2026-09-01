// 数据源适配层（Data Source Adapter）
// ─────────────────────────────────────────────
// 当前数据源：本地打包的 JSON 文件（src/mock/data/*.json），
// 每个左侧菜单对应一个 JSON 文件，页面统一从这一层读取数据。
//
// 预留远程能力：配置环境变量 VITE_DATA_REMOTE_URL 后，
// 会优先通过 fetch 从 `${VITE_DATA_REMOTE_URL}/<menu>.json` 获取数据，
// 失败时自动回退到本地 JSON，便于后续平滑对接真实后端接口。
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

/** 预留：远程数据基地址（配置 VITE_DATA_REMOTE_URL 后启用远程获取） */
const REMOTE_BASE = (import.meta.env.VITE_DATA_REMOTE_URL as string | undefined)?.replace(
  /\/+$/,
  '',
)

/** 同步读取本地打包 JSON（当前默认数据源）。 */
export function getLocalData<T = unknown>(key: MockMenuKey): T {
  return localRegistry[key] as T
}

/** 预留：从远程获取指定菜单的数据（需配置 VITE_DATA_REMOTE_URL）。 */
export async function getRemoteData<T = unknown>(
  key: MockMenuKey,
  signal?: AbortSignal,
): Promise<T> {
  if (!REMOTE_BASE) {
    throw new Error(`[dataSource] 未配置 VITE_DATA_REMOTE_URL，无法从远程获取数据：${key}`)
  }
  const res = await fetch(`${REMOTE_BASE}/${key}.json`, { signal })
  if (!res.ok) {
    throw new Error(`[dataSource] 远程获取数据失败：${key}（HTTP ${res.status}）`)
  }
  return (await res.json()) as T
}

/**
 * 统一的数据入口：配置了远程地址时优先远程获取，失败回退本地；
 * 未配置远程时直接返回本地数据。
 */
export async function getMenuData<T = unknown>(key: MockMenuKey): Promise<T> {
  if (REMOTE_BASE) {
    try {
      return await getRemoteData<T>(key)
    } catch (err) {
      console.warn('[dataSource] 远程数据获取失败，回退本地：', err)
    }
  }
  return getLocalData<T>(key)
}
