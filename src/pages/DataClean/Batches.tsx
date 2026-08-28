import { useState, useMemo } from 'react'
import { Card, Table, Button, Progress, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import SearchForm from '@/components/SearchForm'
import StatusTag from '@/components/StatusTag'
import DataCleanSubNav from './components/DataCleanSubNav'
import { useDataCleanContext } from './DataCleanContext'
import { filterBySearch, filterByStatus, paginate } from '@/utils/mockApi'
import type { SearchParams } from '@/types'
import styles from './index.module.css'

const statusOptions = [
  { label: '排队中', value: 'queued' },
  { label: '运行中', value: 'running' },
  { label: '已完成', value: 'completed' },
  { label: '失败', value: 'failed' },
]

const categoryLabel: Record<string, string> = {
  office: '办公文档',
  multimodal: '多模态',
}

export default function Batches() {
  const navigate = useNavigate()
  const { batches } = useDataCleanContext()
  const [search, setSearch] = useState<SearchParams>({})
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let result = filterBySearch(batches, search.keyword, ['name', 'batchNo', 'submitter'])
    result = filterByStatus(result, search.status)
    return result
  }, [batches, search])

  const paged = paginate(filtered, page, 10)

  const columns = [
    { title: '批次号', dataIndex: 'batchNo', key: 'batchNo', width: 160 },
    { title: '批次名称', dataIndex: 'name', key: 'name', ellipsis: true },
    {
      title: '类型', dataIndex: 'category', key: 'category', width: 100,
      render: (c: string) => <Tag color={c === 'office' ? 'blue' : 'purple'}>{categoryLabel[c] ?? c}</Tag>,
    },
    { title: '提交方', dataIndex: 'submitter', key: 'submitter', width: 90 },
    { title: '文件数', dataIndex: 'fileCount', key: 'fileCount', width: 80 },
    { title: '总页数', dataIndex: 'totalPages', key: 'totalPages', width: 80 },
    {
      title: '进度', dataIndex: 'progress', key: 'progress', width: 140,
      render: (p: number) => <Progress percent={p} size="small" />,
    },
    { title: '状态', dataIndex: 'status', key: 'status', width: 90, render: (s: string) => <StatusTag status={s} /> },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 150 },
    {
      title: '操作', key: 'action', width: 100,
      render: (_: unknown, r: typeof batches[0]) => (
        r.taskId
          ? <Button type="link" size="small" onClick={() => navigate(`/data-clean/task/${r.taskId}`)}>查看任务</Button>
          : <Button type="link" size="small" disabled>—</Button>
      ),
    },
  ]

  return (
    <div>
      <DataCleanSubNav />
      <Card bordered={false} className={styles.metricCard} style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 32, justifyContent: 'center' }}>
          <div><span style={{ color: 'var(--color-text-secondary)' }}>总批次 </span><strong>{batches.length}</strong></div>
          <div><span style={{ color: 'var(--color-text-secondary)' }}>运行中 </span><strong>{batches.filter((b) => b.status === 'running').length}</strong></div>
          <div><span style={{ color: 'var(--color-text-secondary)' }}>已完成 </span><strong>{batches.filter((b) => b.status === 'completed').length}</strong></div>
        </div>
      </Card>
      <SearchForm onSearch={(p) => { setSearch(p); setPage(1) }} statusOptions={statusOptions} />
      <Table
        columns={columns}
        dataSource={paged}
        rowKey="id"
        pagination={{ current: page, pageSize: 10, total: filtered.length, onChange: setPage }}
      />
    </div>
  )
}
