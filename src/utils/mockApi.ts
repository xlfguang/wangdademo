export const delay = (ms = 500): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

/** 生成 [min, max] 闭区间内的随机整数 */
export const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min

/** 生成 [min, max] 之间的随机浮点数，digits 控制小数位数 */
export const randomFloat = (min: number, max: number, digits = 1): number => {
  const f = 10 ** digits
  return Math.round((Math.random() * (max - min) + min) * f) / f
}

/** 从数组中随机取一个元素 */
export const pick = <T>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)]

/** 随机打乱数组（返回新数组，不修改原数组） */
export const shuffle = <T>(arr: readonly T[]): T[] => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** 在 value 基础上按 ratio 比例随机抖动（默认 ±15%），digits 控制小数位 */
export const jitter = (value: number, ratio = 0.15, digits = 0): number => {
  const f = 10 ** digits
  return Math.round((value + (Math.random() * 2 - 1) * value * ratio) * f) / f
}

/** 千分位格式化数字，如 128500 -> "128,500" */
export const formatCount = (n: number): string =>
  Math.round(n).toLocaleString('en-US')

export const filterBySearch = <T>(
  items: T[],
  keyword: string | undefined,
  fields: (keyof T)[],
): T[] => {
  if (!keyword?.trim()) return items
  const lower = keyword.toLowerCase()
  return items.filter((item) =>
    fields.some((field) => String(item[field] ?? '').toLowerCase().includes(lower)),
  )
}

export const filterByStatus = <T extends { status: string }>(
  items: T[],
  status: string | undefined,
): T[] => {
  if (!status) return items
  return items.filter((item) => item.status === status)
}

export const paginate = <T>(items: T[], page: number, pageSize: number): T[] => {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}
