import { useState, useMemo, useEffect } from 'react'
import { Table, Button, Tag, Popconfirm, message } from 'antd'
import { StarOutlined, StarFilled } from '@ant-design/icons'
import PageHeader from '@/components/PageHeader'
import SearchForm from '@/components/SearchForm'
import StatusTag from '@/components/StatusTag'
import AudioSubNav from './components/AudioSubNav'
import { useMenuData } from '@/mock/useMenuData'
import { persistMenuUpdate } from '@/mock/dataSource'
import type { AudioData } from '@/mock/audio'
import { filterBySearch, filterByStatus, paginate, delay } from '@/utils/mockApi'
import type { AudioHistoryRecord, SearchParams } from '@/types'

const statusOptions = [
  { label: '已完成', value: 'completed' },
  { label: '处理中', value: 'running' },
  { label: '失败', value: 'failed' },
]

export default function History() {
  const { data } = useMenuData<AudioData>('audio')
  const [records, setRecords] = useState<AudioHistoryRecord[]>(data.historyRecords)
  const [search, setSearch] = useState<SearchParams>({})
  const [page, setPage] = useState(1)

  useEffect(() => {
    setRecords(data.historyRecords)
  }, [data])

  const filtered = useMemo(() => {
    let r = filterBySearch(records, search.keyword, ['fileName', 'type'])
    r = filterByStatus(r, search.status)
    return r
  }, [records, search])

  const paged = paginate(filtered, page, 10)

  const toggleStar = (id: string) => {
    const next = records.map((r) => (r.id === id ? { ...r, starred: !r.starred } : r))
    setRecords(next)
    persistMenuUpdate<AudioData>('audio', (d) => ({ ...d, historyRecords: d.historyRecords.map((r) => (r.id === id ? { ...r, starred: !r.starred } : r)) }))
  }

  const removeRecord = (id: string) => {
    const next = records.filter((r) => r.id !== id)
    setRecords(next)
    persistMenuUpdate<AudioData>('audio', (d) => ({ ...d, historyRecords: d.historyRecords.filter((r) => r.id !== id) }))
  }

  const columns = [
    {
      title: '',
      key: 'star',
      width: 40,
      render: (_: unknown, record: AudioHistoryRecord) => (
        <Button type="text" size="small" icon={record.starred ? <StarFilled style={{ color: '#f59e0b' }} /> : <StarOutlined />} onClick={() => toggleStar(record.id)} />
      ),
    },
    { title: '操作时间', dataIndex: 'time', key: 'time' },
    { title: '操作类型', dataIndex: 'type', key: 'type', render: (t: string) => <Tag>{t}</Tag> },
    { title: '关联文件名', dataIndex: 'fileName', key: 'fileName', ellipsis: true },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <StatusTag status={s} /> },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: AudioHistoryRecord) => (
        <Popconfirm title="确定删除该记录吗？" onConfirm={async () => { await delay(300); removeRecord(record.id); message.success('删除成功') }}>
          <Button type="link" size="small" danger>删除</Button>
        </Popconfirm>
      ),
    },
  ]

  return (
    <div>
      <AudioSubNav />
      <PageHeader title="历史记录" description="查询音频上传、裁剪、转写、提取等操作历史" />
      <SearchForm onSearch={(p) => { setSearch(p); setPage(1) }} statusOptions={statusOptions} />
      <Table columns={columns} dataSource={paged} rowKey="id" pagination={{ current: page, pageSize: 10, total: filtered.length, onChange: setPage }} />
    </div>
  )
}
