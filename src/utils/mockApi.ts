export const delay = (ms = 500): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

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
