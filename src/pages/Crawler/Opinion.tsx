import { useState, useCallback, useEffect } from 'react'
import { Card, Table, Tag, Drawer, Descriptions, Timeline, Form, Input, Select, Button, message } from 'antd'
import PageHeader from '@/components/PageHeader'
import CrawlerSubNav from './components/CrawlerSubNav'
import OpinionLevelTag from './components/OpinionLevelTag'
import { useMenuData } from '@/mock/useMenuData'
import { persistMenuUpdate } from '@/mock/dataSource'
import type { CrawlerData } from '@/mock/crawler'
import { useDeepLinkAction } from '@/utils/deepLink'
import type { OpinionHotspot } from '@/types'
import styles from './index.module.css'

export default function Opinion() {
  const { data } = useMenuData<CrawlerData>('crawler')
  const { opinionHotspots, alertRecords, levelStrategy } = data
  const [detail, setDetail] = useState<OpinionHotspot | null>(null)
  const [alerts, setAlerts] = useState(alertRecords)

  useEffect(() => {
    setAlerts(data.alertRecords)
  }, [data])

  useDeepLinkAction('detail', useCallback(() => {
    if (opinionHotspots[0]) setDetail(opinionHotspots[0])
  }, []))

  const handleAlertStatus = (id: string, status: string) => {
    const handleStatus = status as '未处理' | '处理中' | '已处理'
    const next = alerts.map((a) => (a.id === id ? { ...a, handleStatus } : a))
    setAlerts(next)
    persistMenuUpdate<CrawlerData>('crawler', (d) => ({ ...d, alertRecords: d.alertRecords.map((a) => (a.id === id ? { ...a, handleStatus } : a)) }))
  }

  const hotspotColumns = [
    { title: '等级', dataIndex: 'level', key: 'level', width: 80, render: (l: OpinionHotspot['level']) => <OpinionLevelTag level={l} /> },
    { title: '热点标题', dataIndex: 'title', key: 'title', ellipsis: true, render: (t: string, r: OpinionHotspot) => <span className={styles.hotspotTitle} onClick={() => setDetail(r)}>{t}</span> },
    { title: '监控对象', dataIndex: 'monitorTarget', key: 'monitorTarget' },
    { title: '发布量', dataIndex: 'publishCount', key: 'publishCount' },
    { title: '互动量', dataIndex: 'interactionCount', key: 'interactionCount', render: (v: number) => v.toLocaleString() },
    { title: '负面占比', dataIndex: 'negativeRatio', key: 'negativeRatio', render: (v: number) => `${v}%` },
    { title: '传播速度', dataIndex: 'spreadSpeed', key: 'spreadSpeed' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Tag>{s}</Tag> },
  ]

  const alertColumns = [
    { title: '预警时间', dataIndex: 'time', key: 'time' },
    { title: '等级', dataIndex: 'level', key: 'level', render: (l: OpinionHotspot['level']) => <OpinionLevelTag level={l} /> },
    { title: '热点标题', dataIndex: 'title', key: 'title', ellipsis: true },
    { title: '推送渠道', dataIndex: 'channel', key: 'channel' },
    { title: '接收人', dataIndex: 'receiver', key: 'receiver' },
    { title: '推送状态', dataIndex: 'pushStatus', key: 'pushStatus', render: (s: string) => s === 'success' ? <Tag color="success">成功</Tag> : <Tag color="error">失败</Tag> },
    {
      title: '处理状态', dataIndex: 'handleStatus', key: 'handleStatus',
      render: (s: string, r: typeof alerts[0]) => (
        <Select size="small" value={s} style={{ width: 90 }} options={['未处理', '处理中', '已处理'].map((v) => ({ label: v, value: v }))} onChange={(v) => handleAlertStatus(r.id, v)} />
      ),
    },
  ]

  return (
    <div>
      <CrawlerSubNav />
      <PageHeader title="舆情监控" description="热点自动识别、分级预警与追溯分析" />
      <Card title="监控配置" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
        <Form layout="inline">
          <Form.Item label="监控对象"><Input placeholder="企业/品牌/产品名称" defaultValue="某品牌, AI监管, 新能源汽车" style={{ width: 280 }} /></Form.Item>
          <Form.Item label="监控渠道"><Select mode="multiple" defaultValue={['微博', '知乎', '新闻媒体']} style={{ width: 220 }} options={['微博', '知乎', '今日头条', '新闻媒体', '行业论坛'].map((v) => ({ label: v, value: v }))} /></Form.Item>
          <Form.Item label="时间范围"><Select defaultValue="realtime" style={{ width: 120 }} options={[{ label: '实时监控', value: 'realtime' }, { label: '近24小时', value: '24h' }, { label: '近7天', value: '7d' }]} /></Form.Item>
          <Button type="primary" onClick={() => message.success('监控配置已保存')}>保存</Button>
        </Form>
      </Card>
      <Card title="舆情热点" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
        <Table columns={hotspotColumns} dataSource={opinionHotspots} rowKey="id" size="middle" pagination={false} />
      </Card>
      <Card title="预警记录" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
        <Table columns={alertColumns} dataSource={alerts} rowKey="id" size="small" pagination={{ pageSize: 5 }} />
      </Card>
      <Drawer title="热点详情" open={!!detail} onClose={() => setDetail(null)} width={560}>
        {detail && (
          <>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="等级"><OpinionLevelTag level={detail.level} /></Descriptions.Item>
              <Descriptions.Item label="标题">{detail.title}</Descriptions.Item>
              <Descriptions.Item label="摘要">{detail.summary}</Descriptions.Item>
              <Descriptions.Item label="监控对象">{detail.monitorTarget}</Descriptions.Item>
              <Descriptions.Item label="传播平台">{detail.platforms.join('、')}</Descriptions.Item>
              <Descriptions.Item label="情感倾向">{detail.sentiment}</Descriptions.Item>
              <Descriptions.Item label="首次发现">{detail.firstSeen}</Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>传播时间线</div>
              <Timeline items={[
                { children: `${detail.firstSeen} — 首条信息出现在 ${detail.platforms[0]}` },
                { children: '1小时后 — 传播至多个平台，互动量快速上升' },
                { children: '3小时后 — 触发预警推送' },
              ]} />
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>响应策略建议</div>
              <div className={styles.strategyBlock}>{levelStrategy[detail.level]}</div>
            </div>
          </>
        )}
      </Drawer>
    </div>
  )
}
