import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

export type DeepLinkParams = Record<string, string | undefined>

const DEFAULT_CLEAR_KEYS = ['processType', 'scenario', 'category', 'keyword', 'scheduleType', 'tab', 'batchName', 'next']
const EMPTY_EXTRA_KEYS: string[] = []

/** 防止 StrictMode 或依赖抖动导致同一 deep link 重复触发 */
const handledDeepLinks = new Set<string>()

function getDeepLinkKey(pathname: string, search: string): string {
  return `${pathname}?${search}`
}

function pruneHandledKey(key: string) {
  window.setTimeout(() => handledDeepLinks.delete(key), 2000)
}

export function buildDeepLink(path: string, params?: DeepLinkParams): string {
  if (!params) return path
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([k, value]) => {
    if (value) qs.set(k, value)
  })
  const query = qs.toString()
  return query ? `${path}?${query}` : path
}

export function useDeepLinkAction(
  action: string,
  handler: (params: URLSearchParams) => void,
  extraClearKeys: string[] = EMPTY_EXTRA_KEYS,
) {
  const [searchParams, setSearchParams] = useSearchParams()
  const handlerRef = useRef(handler)
  handlerRef.current = handler

  useEffect(() => {
    if (searchParams.get('action') !== action) return

    const key = getDeepLinkKey(window.location.pathname, searchParams.toString())
    if (handledDeepLinks.has(key)) return
    handledDeepLinks.add(key)
    pruneHandledKey(key)

    handlerRef.current(searchParams)

    const next = new URLSearchParams(searchParams)
    ;['action', ...DEFAULT_CLEAR_KEYS, ...extraClearKeys].forEach((k) => next.delete(k))
    setSearchParams(next, { replace: true })
  }, [action, searchParams, setSearchParams, extraClearKeys])
}

export function useDeepLinkParam(key: string, handler: (value: string) => void) {
  const [searchParams, setSearchParams] = useSearchParams()
  const handlerRef = useRef(handler)
  handlerRef.current = handler

  useEffect(() => {
    const value = searchParams.get(key)
    if (!value) return

    const sig = getDeepLinkKey(window.location.pathname, `${key}=${value}`)
    if (handledDeepLinks.has(sig)) return
    handledDeepLinks.add(sig)
    pruneHandledKey(sig)

    handlerRef.current(value)

    const next = new URLSearchParams(searchParams)
    next.delete(key)
    setSearchParams(next, { replace: true })
  }, [key, searchParams, setSearchParams])
}
