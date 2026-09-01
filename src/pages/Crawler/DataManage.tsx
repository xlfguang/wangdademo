import { useState, useMemo } from 'react'
import { Card, Table, Tag, Button, Progress, Row, Col, message } from 'antd'
import { ExportOutlined } from '@ant-design/icons'
import PageHeader from '@/components/PageHeader'
import SearchForm from '@/components/SearchForm'
import { useMenuData } from '@/mock/useMenuData'
import type { CrawlerData } from '@/mock/crawler'
import CrawlerSubNav from './components/CrawlerSubNav'
import { filterBySearch, paginate } from '@/utils/mockApi'
import type { SearchParams } from '@/types'
import styles from './index.module.css'

const sentimentOptions = [
  { label: '正面', value: 'positive' },
  { label: '中性', value: 'neutral' },
  { label: '负面', value: 'negative' },
]

export default function DataManage() {
  const { data } = useMenuData<CrawlerData>('crawler')
  const { storedDataRecords, storageStats } = data
  const [search, setSearch] = useState<SearchParams>({})
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let r = filterBySearch(storedDataRecords, search.keyword, ['title', 'content', 'source'])
    if (search.status) r = r.filter((item) => item.sentiment === search.status)
    return r
  }, [search])

  const paged = paginate(filtered, page, 10)

  const columns = [
    { title: '标题', dataIndex: 'title', key: 'title', ellipsis: true },
    { title: '来源', dataIndex: 'source', key: 'source' },
    { title: '发布时间', dataIndex: 'publishTime', key: 'publishTime' },
    { title: '类型', dataIndex: 'dataType', key: 'dataType' },
    { title: '信源等级', dataIndex: 'sourceLevel', key: 'sourceLevel', render: (l: string) => l && <Tag>{l}</Tag> },
    { title: '情感', dataIndex: 'sentiment', key: 'sentiment', render: (s: string) => s === 'negative' ? <Tag color="error">负面</Tag> : s === 'positive' ? <Tag color="success">正面</Tag> : <Tag>中性</Tag> },
  ]

  const localPercent = Math.round((2.8 / 10) * 100)
  const cloudPercent = Math.round((15.2 / 50) * 100)

  return (
    <div>
      <CrawlerSubNav />
      <PageHeader title="数据管理" description="检索、导出已存储数据，查看存储容量" extra={
        <Button icon={<ExportOutlined />} onClick={() => message.success('已导出 Excel')}>导出数据</Button>
      } />
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card title="本地存储" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
            <div className={styles.storageBar}><Progress percent={localPercent} format={() => `${storageStats.localUsed} / ${storageStats.localTotal}`} /></div>
            {storageStats.categories.slice(0, 3).map((c) => (<div key={c.name} style={{ fontSize: 13, marginBottom: 4 }}>{c.name}：{c.size}</div>))}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="云端存储" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
            <div className={styles.storageBar}><Progress percent={cloudPercent} strokeColor="#7c5cfc" format={() => `${storageStats.cloudUsed} / ${storageStats.cloudTotal}`} /></div>
            {storageStats.categories.slice(3).map((c) => (<div key={c.name} style={{ fontSize: 13, marginBottom: 4 }}>{c.name}：{c.size}</div>))}
          </Card>
        </Col>
      </Row>
      <SearchForm onSearch={(p) => { setSearch(p); setPage(1) }} statusOptions={sentimentOptions} />
      <Table columns={columns} dataSource={paged} rowKey="id" pagination={{ current: page, pageSize: 10, total: filtered.length, onChange: setPage }} />
    </div>
  )
}
