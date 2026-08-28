import { useState, useCallback } from 'react'
import { Card, Form, Input, Select, Radio, Row, Col, Button, Progress, Table, Tag, InputNumber, message } from 'antd'
import PageHeader from '@/components/PageHeader'
import CrawlerSubNav from './components/CrawlerSubNav'
import { useCrawlerContext, searchResultsMock } from './CrawlerContext'
import { keywordGroups, searchLogsMock } from '@/mock/crawler'
import { useDeepLinkAction } from '@/utils/deepLink'
import { delay, generateId } from '@/utils/mockApi'
import type { CrawlerTask } from '@/types'
import styles from './index.module.css'

export default function Search() {
  const { addTask, searchResults, setSearchResults } = useCrawlerContext()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useDeepLinkAction('focus', useCallback((params) => {
    const keyword = params.get('keyword')
    const scheduleType = params.get('scheduleType')
    if (keyword) form.setFieldsValue({ keyword })
    if (scheduleType) form.setFieldsValue({ scheduleType })
  }, [form]))

  const handleSearch = async () => {
    const values = await form.validateFields()
    setLoading(true)
    setDone(false)
    setProgress(0)
    for (let i = 0; i <= 100; i += 20) {
      setProgress(i)
      await delay(400)
    }
    setSearchResults(searchResultsMock)
    setDone(true)
    setLoading(false)
    const task: CrawlerTask = {
      id: generateId(),
      taskId: `CR${Date.now()}`,
      name: `${values.keyword} 检索任务`,
      keyword: values.keyword,
      source: values.dataSource,
      dataSource: values.dataSource,
      collectCount: values.maxCollect,
      collectedCount: searchResultsMock.filter((r) => !r.isDuplicate).length,
      progress: 100,
      status: 'completed',
      scheduleType: values.scheduleType,
      timeRange: values.timeRange,
      dedupeRate: 12,
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
      updatedAt: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
    }
    addTask(task)
    message.success('检索完成，已抓取并去重')
  }

  const resultColumns = [
    { title: '标题', dataIndex: 'title', key: 'title', ellipsis: true, render: (t: string, r: typeof searchResultsMock[0]) => (<>{t}{r.isDuplicate && <Tag color="orange" style={{ marginLeft: 8 }}>重复</Tag>}</>) },
    { title: '来源', dataIndex: 'source', key: 'source' },
    { title: '发布时间', dataIndex: 'publishTime', key: 'publishTime' },
    { title: '类型', dataIndex: 'dataType', key: 'dataType' },
    { title: '信源等级', dataIndex: 'sourceLevel', key: 'sourceLevel', render: (l: string) => l && <Tag color={l === '一级' ? 'red' : l === '二级' ? 'orange' : 'default'}>{l}</Tag> },
    { title: '情感', dataIndex: 'sentiment', key: 'sentiment', render: (s: string) => s === 'negative' ? <Tag color="error">负面</Tag> : s === 'positive' ? <Tag color="success">正面</Tag> : <Tag>中性</Tag> },
  ]

  const logColumns = [
    { title: '数据标题', dataIndex: 'title', key: 'title', ellipsis: true },
    { title: '抓取时间', dataIndex: 'time', key: 'time' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => s === 'success' ? <Tag color="success">成功</Tag> : <Tag color="error">失败</Tag> },
    { title: '失败原因', dataIndex: 'reason', key: 'reason', render: (r: string) => r ?? '—' },
  ]

  const original = searchResults.length
  const duplicate = searchResults.filter((r) => r.isDuplicate).length
  const afterDedupe = original - duplicate

  return (
    <div>
      <CrawlerSubNav />
      <PageHeader title="检索工作台" description="配置关键词与筛选条件，发起检索与数据抓取" />
      <Row gutter={16}>
        <Col span={10}>
          <Card title="检索配置" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
            <Form form={form} layout="vertical" initialValues={{ logic: 'and', matchMode: 'fuzzy', timeRange: '近7天', dataSource: '百度', scheduleType: 'instant', threads: 10, interval: 500, maxCollect: 1000, dedupeLevel: 'medium' }}>
              <Form.Item name="keyword" label="关键词" rules={[{ required: true, message: '请输入关键词' }]}><Input placeholder="如：新能源汽车 政策" /></Form.Item>
              <Form.Item name="keywordGroup" label="关键词分组">
                <Select allowClear placeholder="选择分组" options={keywordGroups.map((g) => ({ label: g.name, value: g.id }))} />
              </Form.Item>
              <Row gutter={12}>
                <Col span={12}><Form.Item name="logic" label="逻辑关系"><Radio.Group options={[{ label: '与', value: 'and' }, { label: '或', value: 'or' }, { label: '非', value: 'not' }]} optionType="button" buttonStyle="solid" size="small" /></Form.Item></Col>
                <Col span={12}><Form.Item name="matchMode" label="匹配模式"><Radio.Group options={[{ label: '模糊', value: 'fuzzy' }, { label: '精准', value: 'exact' }]} optionType="button" buttonStyle="solid" size="small" /></Form.Item></Col>
              </Row>
              <Row gutter={12}>
                <Col span={12}><Form.Item name="timeRange" label="时间范围"><Select options={['近1小时', '近6小时', '近1天', '近3天', '近7天', '近30天'].map((v) => ({ label: v, value: v }))} /></Form.Item></Col>
                <Col span={12}><Form.Item name="dataSource" label="数据源"><Select options={['百度', '搜狗', '多渠道', '行业数据库'].map((v) => ({ label: v, value: v }))} /></Form.Item></Col>
              </Row>
              <Form.Item name="dataTypes" label="数据类型"><Select mode="multiple" placeholder="选择类型" options={['新闻报道', '论坛帖子', '微博内容', '行业报告', 'PDF文档'].map((v) => ({ label: v, value: v }))} /></Form.Item>
              <Form.Item name="platforms" label="发布平台"><Select mode="multiple" placeholder="选择平台" options={['微信公众号', '微博', '知乎', '今日头条', '新浪新闻'].map((v) => ({ label: v, value: v }))} /></Form.Item>
              <Form.Item name="scheduleType" label="检索方式"><Radio.Group options={[{ label: '即时检索', value: 'instant' }, { label: '定时检索', value: 'scheduled' }]} /></Form.Item>
              <Row gutter={12}>
                <Col span={8}><Form.Item name="threads" label="线程数"><InputNumber min={1} max={50} style={{ width: '100%' }} /></Form.Item></Col>
                <Col span={8}><Form.Item name="interval" label="间隔(ms)"><InputNumber min={100} max={5000} step={100} style={{ width: '100%' }} /></Form.Item></Col>
                <Col span={8}><Form.Item name="maxCollect" label="最大抓取量"><InputNumber min={10} max={10000} style={{ width: '100%' }} /></Form.Item></Col>
              </Row>
              <Form.Item name="dedupeLevel" label="去重精度"><Radio.Group options={[{ label: '高', value: 'high' }, { label: '中', value: 'medium' }, { label: '低', value: 'low' }]} optionType="button" buttonStyle="solid" size="small" /></Form.Item>
              <Button type="primary" block loading={loading} onClick={handleSearch}>开始检索</Button>
              {loading && <Progress percent={progress} style={{ marginTop: 12 }} format={(p) => `抓取中... ${p}%`} />}
            </Form>
          </Card>
        </Col>
        <Col span={14}>
          {done && (
            <div className={styles.dedupeStats}>
              <div className={styles.dedupeItem}><div className={styles.dedupeValue}>{original}</div><div className={styles.dedupeLabel}>原始数据量</div></div>
              <div className={styles.dedupeItem}><div className={styles.dedupeValue}>{duplicate}</div><div className={styles.dedupeLabel}>重复数据量</div></div>
              <div className={styles.dedupeItem}><div className={styles.dedupeValue}>{afterDedupe}</div><div className={styles.dedupeLabel}>去重后数据量</div></div>
              <div className={styles.dedupeItem}><div className={styles.dedupeValue}>{original ? Math.round((duplicate / original) * 100) : 0}%</div><div className={styles.dedupeLabel}>去重率</div></div>
            </div>
          )}
          <Card title="抓取结果" bordered={false} style={{ boxShadow: 'var(--shadow-card)', marginBottom: 16 }}>
            {searchResults.length > 0 ? (
              <Table columns={resultColumns} dataSource={searchResults} rowKey="id" size="small" pagination={{ pageSize: 5 }} />
            ) : (
              <div className={styles.aiPanel} style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>配置检索条件后点击「开始检索」</div>
            )}
          </Card>
          {done && (
            <Card title="抓取日志" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
              <Table columns={logColumns} dataSource={searchLogsMock} rowKey="id" size="small" pagination={false} />
            </Card>
          )}
        </Col>
      </Row>
    </div>
  )
}
