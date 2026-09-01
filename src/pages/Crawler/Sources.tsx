import { useState, useCallback } from 'react'
import { Card, Row, Col, Table, Tag, Button, Form, InputNumber, Radio, message, Modal } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, ApiOutlined } from '@ant-design/icons'
import PageHeader from '@/components/PageHeader'
import CrawlerSubNav from './components/CrawlerSubNav'
import { useMenuData } from '@/mock/useMenuData'
import type { CrawlerData } from '@/mock/crawler'
import { useDeepLinkAction } from '@/utils/deepLink'
import { delay } from '@/utils/mockApi'
import type { CrawlerDataSource } from '@/types'
import styles from './index.module.css'

const statusIcon = (s: CrawlerDataSource['status']) => {
  if (s === 'connected') return <CheckCircleOutlined style={{ color: '#52c41a' }} />
  if (s === 'error') return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
  return <CloseCircleOutlined style={{ color: '#d9d9d9' }} />
}

const statusText: Record<CrawlerDataSource['status'], string> = {
  connected: '已连接',
  disconnected: '未连接',
  error: '异常',
}

export default function Sources() {
  const { data } = useMenuData<CrawlerData>('crawler')
  const { dataSources, trustedSources } = data
  const [testing, setTesting] = useState<string | null>(null)
  const [sourceFilter, setSourceFilter] = useState('priority')

  const handleTest = async (ds: CrawlerDataSource) => {
    setTesting(ds.id)
    await delay(1200)
    setTesting(null)
    Modal.info({
      title: '接口测试结果',
      content: (
        <div>
          <p><strong>{ds.name}</strong> — 连接成功</p>
          <p>响应时间：128ms</p>
          <p>返回样例：{"{ \"results\": [{ \"title\": \"示例数据\" }] }"}</p>
        </div>
      ),
    })
  }

  useDeepLinkAction('test', useCallback(() => {
    const ds = dataSources[0]
    if (ds) handleTest(ds)
  }, []))

  const sourceColumns = [
    { title: '信源名称', dataIndex: 'name', key: 'name' },
    { title: '网址', dataIndex: 'url', key: 'url' },
    { title: '等级', dataIndex: 'level', key: 'level', render: (l: string) => <Tag color={l === '一级' ? 'red' : l === '二级' ? 'orange' : 'default'}>{l}</Tag> },
    { title: '行业', dataIndex: 'industry', key: 'industry' },
  ]

  return (
    <div>
      <CrawlerSubNav />
      <PageHeader title="数据源与信源" description="配置搜索引擎对接参数，管理权威信源库" />
      <Card title="搜索引擎 / 数据库对接" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
        <Row gutter={[16, 16]}>
          {dataSources.map((ds) => (
            <Col xs={24} sm={12} lg={8} key={ds.id}>
              <div className={styles.sourceCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <strong>{ds.name}</strong>
                  {ds.isDefault && <Tag color="blue">默认</Tag>}
                </div>
                <div style={{ marginBottom: 8 }}>{statusIcon(ds.status)} <span style={{ marginLeft: 6 }}>{statusText[ds.status]}</span></div>
                <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 12 }}>
                  优先级 {ds.priority} · 超时 {ds.timeout}s · 频率 {ds.rateLimit}次/s
                </div>
                <Button size="small" icon={<ApiOutlined />} loading={testing === ds.id} onClick={() => handleTest(ds)}>接口测试</Button>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
      <Row gutter={16}>
        <Col span={10}>
          <Card title="接口参数配置" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
            <Form layout="vertical" initialValues={{ timeout: 10, rateLimit: 3, maxRetry: 3 }}>
              <Form.Item name="timeout" label="请求超时（秒）"><InputNumber min={1} max={30} style={{ width: '100%' }} /></Form.Item>
              <Form.Item name="rateLimit" label="请求频率（次/秒）"><InputNumber min={1} max={10} style={{ width: '100%' }} /></Form.Item>
              <Form.Item name="maxRetry" label="最大重试次数"><InputNumber min={1} max={5} style={{ width: '100%' }} /></Form.Item>
              <Button type="primary" onClick={() => message.success('参数配置已保存')}>保存配置</Button>
            </Form>
          </Card>
        </Col>
        <Col span={14}>
          <Card title="权威信源库" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }} extra={
            <Radio.Group value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} size="small" optionType="button" buttonStyle="solid" options={[{ label: '优先保留', value: 'priority' }, { label: '仅保留', value: 'only' }, { label: '不筛选', value: 'none' }]} />
          }>
            <Table columns={sourceColumns} dataSource={trustedSources} rowKey="id" size="small" pagination={false} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
