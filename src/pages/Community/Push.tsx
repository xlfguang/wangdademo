import { useState } from 'react'
import type { ReactNode } from 'react'
import { Card, Row, Col, Statistic, Table, Form, Input, Select, Button, Tag, message } from 'antd'
import {
  WechatOutlined,
  MailOutlined,
  MessageOutlined,
  GlobalOutlined,
  SendOutlined,
} from '@ant-design/icons'
import PageHeader from '@/components/PageHeader'
import StatusTag from '@/components/StatusTag'
import CommunitySubNav from './components/CommunitySubNav'
import { channels, pushTemplates, pushStrategies } from '@/mock/community'
import { delay } from '@/utils/mockApi'
import styles from './index.module.css'

const { TextArea } = Input

const iconMap: Record<string, ReactNode> = {
  wechat: <WechatOutlined />,
  wework: <MessageOutlined />,
  sms: <SendOutlined />,
  email: <MailOutlined />,
  telegram: <SendOutlined />,
  web: <GlobalOutlined />,
}

export default function Push() {
  const [form] = Form.useForm()
  const [selectedTemplate, setSelectedTemplate] = useState(pushTemplates[0].id)
  const [sending, setSending] = useState(false)

  const template = pushTemplates.find((t) => t.id === selectedTemplate) ?? pushTemplates[0]

  const handleTemplateChange = (id: string) => {
    setSelectedTemplate(id)
    const t = pushTemplates.find((p) => p.id === id)
    if (t) {
      form.setFieldsValue({ title: t.title, content: t.content })
    }
  }

  const handleTestSend = async () => {
    const values = await form.validateFields()
    setSending(true)
    await delay(600)
    setSending(false)
    message.success(`测试消息已通过 ${values.testChannel} 发送成功`)
  }

  const strategyColumns = [
    { title: '策略名称', dataIndex: 'name', key: 'name' },
    { title: '渠道', dataIndex: 'channel', key: 'channel', render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: '触发条件', dataIndex: 'trigger', key: 'trigger', ellipsis: true },
    { title: '频率', dataIndex: 'frequency', key: 'frequency' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <StatusTag status={s} /> },
    { title: '最近执行', dataIndex: 'lastRun', key: 'lastRun' },
  ]

  return (
    <div>
      <CommunitySubNav />
      <PageHeader title="多渠道推送" description="渠道管理、模板编辑、推送策略与测试发送" />
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {channels.map((ch) => (
          <Col xs={24} sm={12} lg={8} key={ch.id}>
            <Card className={`${styles.channelCard} card-hover`} bordered={false}>
              <div className={styles.channelHeader}>
                <span className={styles.channelIcon}>{iconMap[ch.icon]}</span>
                <span className={styles.channelName}>{ch.name}</span>
                <StatusTag status={ch.status} />
              </div>
              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={12}><Statistic title="今日发送" value={ch.todaySent} /></Col>
                <Col span={12}><Statistic title="累计发送" value={ch.totalSent} /></Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="模板编辑" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
            <Form form={form} layout="vertical" initialValues={{ templateId: template.id, title: template.title, content: template.content, testChannel: '企业微信' }}>
              <Form.Item name="templateId" label="选择模板">
                <Select
                  options={pushTemplates.map((t) => ({ label: t.name, value: t.id }))}
                  onChange={handleTemplateChange}
                />
              </Form.Item>
              <Form.Item name="title" label="消息标题">
                <Input placeholder="支持 {{变量}} 占位符" />
              </Form.Item>
              <Form.Item name="content" label="消息内容">
                <TextArea rows={5} placeholder="支持 {{变量}} 占位符" />
              </Form.Item>
              <div style={{ marginBottom: 16 }}>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>可用变量：</span>
                {template.variables.map((v) => <Tag key={v} style={{ marginTop: 4 }}>{`{{${v}}}`}</Tag>)}
              </div>
              <Form.Item name="testChannel" label="测试渠道" rules={[{ required: true }]}>
                <Select options={channels.filter((c) => c.status === 'connected').map((c) => ({ label: c.name, value: c.name }))} />
              </Form.Item>
              <Button type="primary" loading={sending} icon={<SendOutlined />} onClick={handleTestSend}>发送测试消息</Button>
            </Form>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="推送策略" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
            <Table columns={strategyColumns} dataSource={pushStrategies} rowKey="id" size="small" pagination={false} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
