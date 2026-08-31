import { delay } from '@/utils/mockApi'

type ExportFormat = 'csv' | 'json' | 'pdf'

function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return ''
  const headers = Object.keys(rows[0])
  const lines = [headers.join(',')]
  rows.forEach((row) => {
    lines.push(headers.map((h) => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(','))
  })
  return lines.join('\n')
}

export async function exportReport(
  format: ExportFormat,
  filename: string,
  data: Record<string, unknown>[] | object,
): Promise<void> {
  await delay(500)
  const base = filename.replace(/\.[^.]+$/, '')
  if (format === 'json') {
    downloadBlob(JSON.stringify(data, null, 2), `${base}.json`, 'application/json')
    return
  }
  if (format === 'csv') {
    const rows = Array.isArray(data) ? data : [data as Record<string, unknown>]
    downloadBlob(toCsv(rows), `${base}.csv`, 'text/csv;charset=utf-8')
    return
  }
  const text = typeof data === 'string'
    ? data
    : `网达智能体调度平台 — 报表导出\n生成时间：${new Date().toLocaleString('zh-CN')}\n\n${JSON.stringify(data, null, 2)}`
  downloadBlob(text, `${base}.pdf.txt`, 'text/plain;charset=utf-8')
}
