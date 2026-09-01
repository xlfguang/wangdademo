import { useCallback, useEffect, useState } from 'react'
import { getLocalData, getMenuData, type MockMenuKey } from './dataSource'

export interface MenuDataState<T> {
  /** 菜单数据：初始为本地 JSON（立即可用），后端拉到后自动替换 */
  data: T
  loading: boolean
  error: Error | null
  refresh: () => void
}

/**
 * 从后端加载某个菜单的 JSON 数据；未拉到前先用本地打包 JSON 兜底，
 * 加载失败时自动回退本地数据。
 */
export function useMenuData<T = unknown>(key: MockMenuKey): MenuDataState<T> {
  const [data, setData] = useState<T>(() => getLocalData<T>(key))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refresh = useCallback(() => {
    setLoading(true)
    getMenuData<T>(key)
      .then((remote) => {
        setData(remote)
        setError(null)
      })
      .catch((err) => setError(err as Error))
      .finally(() => setLoading(false))
  }, [key])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { data, loading, error, refresh }
}
