import { useState, useCallback } from 'react'
import {
  Card, Upload, Radio, Form, Input, Select, Button, Table, Tag, message, Alert, Modal,
} from 'antd'
import { InboxOutlined, WarningOutlined } from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd'
import DataCleanSubNav from './components/DataCleanSubNav'
import { useDataCleanContext } from './DataCleanContext'
import { quotaLimits, negotiationRecords } from '@/mock/dataClean'
import { useDeepLinkAction, useDeepLinkParam } from '@/utils/deepLink'
import { delay, generateId } from '@/utils/mockApi'
import type { DocumentCategory, DataCleanTask, CleanBatch } from '@/types'
import styles from './index.module.css'

interface FileMeta {
  uid: string
  name: string
  size: string
  pages: number
  duration?: string
}

const OFFICE_EXT = /\.(doc|docx|pdf)$/i
const MULTIMODAL_EXT = /\.(jpg|jpeg|png|pdf|mp3|wav|mp4|mov)$/i

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function mockPages(name: string, category: DocumentCategory): number {
  const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  if (category === 'multimodal') {
    if (/\.(mp3|wav)$/i.test(name)) return Math.max(1, (hash % 8) + 1)
    if (/\.(mp4|mov)$/i.test(name)) return Math.max(1, (hash % 12) + 1)
    return Math.max(1, (hash % 4) + 1)
  }
  return Math.max(1, (hash % 45) + 5)
}

export default function UploadPage() {
  const { addTask, addBatch } = useDataCleanContext()
  const [form] = Form.useForm()
  const [category, setCategory] = useState<DocumentCategory>('office')
  const [fileList, setFileList] = useState<FileMeta[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [negotiationOpen, setNegotiationOpen] = useState(false)

  useDeepLinkParam('category', useCallback((value) => {
    if (value === 'office' || value === 'multimodal') setCategory(value)
  }, []))

  useDeepLinkParam('batchName', useCallback((value) => {
    form.setFieldsValue({ batchName: value })
  }, [form]))

  useDeepLinkAction('negotiate', useCallback(() => setNegotiationOpen(true), []))

  const totalPages = fileList.reduce((sum, f) => sum + f.pages, 0)

  const validateQuota = (): { ok: boolean; message?: string } => {
    if (fileList.length === 0) return { ok: false, message: '请先上传文档' }
    if (category === 'office') {
      if (fileList.length > quotaLimits.office.maxFiles) {
        return { ok: false, message: `办公文档单批次不超过 ${quotaLimits.office.maxFiles} 份，当前 ${fileList.length} 份` }
      }
      const overPage = fileList.find((f) => f.pages > quotaLimits.office.maxPagesPerFile)
      if (overPage) {
        return { ok: false, message: `「${overPage.name}」超过单份 ${quotaLimits.office.maxPagesPerFile} 页上限（${overPage.pages} 页）` }
      }
    } else {
      if (totalPages > quotaLimits.multimodal.maxEquivalentPages) {
        return { ok: false, message: `多模态文档单批次不超过 ${quotaLimits.multimodal.maxEquivalentPages} 等效页，当前 ${totalPages} 页` }
      }
    }
    return { ok: true }
  }

  const uploadProps: UploadProps = {
    multiple: true,
    showUploadList: false,
    beforeUpload: (file) => {
      const isOffice = OFFICE_EXT.test(file.name)
      const isMultimodal = MULTIMODAL_EXT.test(file.name)
      if (category === 'office' && !isOffice) {
        message.error('办公文档仅支持 .doc/.docx/.pdf 格式')
        return Upload.LIST_IGNORE
      }
      if (category === 'multimodal' && !isMultimodal) {
        message.error('多模态文档支持图片/扫描/音频/视频格式')
        return Upload.LIST_IGNORE
      }
      const pages = mockPages(file.name, category)
      setFileList((prev) => [...prev, {
        uid: file.uid,
        name: file.name,
        size: formatSize(file.size),
        pages,
        duration: /\.(mp3|wav|mp4|mov)$/i.test(file.name) ? `${pages}:${String(pages * 3 % 60).padStart(2, '0')}` : undefined,
      }])
      return false
    },
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    const check = validateQuota()
    if (!check.ok) {
      message.warning(check.message)
      setNegotiationOpen(true)
      return
    }
    setSubmitting(true)
    await delay(800)
    const batchId = generateId()
    const batchNo = `DC${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(Math.floor(Math.random() * 9000) + 1000)}`
    const now = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
    const batch: CleanBatch = {
      id: batchId,
      batchNo,
      name: values.batchName,
      category,
      submitter: values.submitter,
      businessLine: values.businessLine,
      fileCount: fileList.length,
      totalPages,
      status: 'queued',
      progress: 0,
      createdAt: now,
      updatedAt: now,
    }
    const task: DataCleanTask = {
      id: generateId(),
      taskId: batchNo,
      batchId,
      batchNo,
      name: values.batchName,
      dataSource: values.businessLine,
      category,
      originalCount: fileList.length,
      validCount: 0,
      duplicateCount: 0,
      abnormalCount: 0,
      qualityRate: 0,
      progress: 0,
      status: 'queued',
      createdAt: now,
      updatedAt: now,
    }
    addBatch(batch)
    addTask(task)
    setSubmitting(false)
    setFileList([])
    form.resetFields()
    message.success(`批次 ${batchNo} 创建成功，已进入清洗队列`)
  }

  const columns = [
    { title: '文件名', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '大小', dataIndex: 'size', key: 'size', width: 100 },
    { title: category === 'office' ? '页数' : '等效页', dataIndex: 'pages', key: 'pages', width: 80 },
    { title: '时长', dataIndex: 'duration', key: 'duration', width: 80, render: (v: string) => v ?? '—' },
    {
      title: '操作', key: 'action', width: 80,
      render: (_: unknown, r: FileMeta) => (
        <Button type="link" size="small" danger onClick={() => setFileList((prev) => prev.filter((f) => f.uid !== r.uid))}>移除</Button>
      ),
    },
  ]

  const quotaCheck = validateQuota()

  return (
    <div>
      <DataCleanSubNav />
      <Card bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
        <Alert
          type="info"
          showIcon
          message="配额规则"
          description={
            <div className={styles.quotaPanel} style={{ marginTop: 8, marginBottom: 0 }}>
              <div className={styles.quotaItem}><span>办公文档（Word/PDF）</span><span>单批次 ≤ {quotaLimits.office.maxFiles} 份，每份 ≤ {quotaLimits.office.maxPagesPerFile} 页</span></div>
              <div className={styles.quotaItem}><span>多模态文档（图片/扫描/音视频）</span><span>单批次 ≤ {quotaLimits.multimodal.maxEquivalentPages} 等效页</span></div>
            </div>
          }
        />
      </Card>
      <Form form={form} layout="vertical">
        <Card title="文档类型与批次信息" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <Form.Item label="文档类型">
            <Radio.Group value={category} onChange={(e) => { setCategory(e.target.value); setFileList([]) }}>
              <Radio.Button value="office">办公文档（Word/PDF）</Radio.Button>
              <Radio.Button value="multimodal">多模态文档</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="batchName" label="批次名称" rules={[{ required: true, message: '请输入批次名称' }]}>
            <Input placeholder="如：产品资料库清洗批次" />
          </Form.Item>
          <Form.Item name="submitter" label="提交方" rules={[{ required: true, message: '请输入提交方' }]}>
            <Input placeholder="提交人姓名" />
          </Form.Item>
          <Form.Item name="businessLine" label="业务线" rules={[{ required: true, message: '请选择业务线' }]}>
            <Select options={['产品中心', '合规部', '客服中心', '供应链', '法务部'].map((v) => ({ label: v, value: v }))} placeholder="选择业务线" />
          </Form.Item>
        </Card>
        <Card title="文档上传" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <Upload.Dragger {...uploadProps} fileList={fileList as unknown as UploadFile[]}>
            <p className="ant-upload-drag-icon"><InboxOutlined style={{ fontSize: 40, color: '#1677ff' }} /></p>
            <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
            <p className="ant-upload-hint">支持本地预览，上传后自动识别页数与时长</p>
          </Upload.Dragger>
          {fileList.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ marginBottom: 8, color: 'var(--color-text-secondary)' }}>
                已选 {fileList.length} 个文件，合计 {totalPages} {category === 'office' ? '页' : '等效页'}
                {!quotaCheck.ok && <Tag color="warning" icon={<WarningOutlined />} style={{ marginLeft: 8 }}>超配额</Tag>}
              </div>
              <Table columns={columns} dataSource={fileList} rowKey="uid" size="small" pagination={false} />
            </div>
          )}
        </Card>
        <Button type="primary" loading={submitting} onClick={handleSubmit} disabled={fileList.length === 0}>
          提交清洗
        </Button>
      </Form>
      <Modal
        title="配额超限 — 人工协商"
        open={negotiationOpen}
        onCancel={() => setNegotiationOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setNegotiationOpen(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={() => { setNegotiationOpen(false); message.info('协商申请已提交') }}>发起协商</Button>,
        ]}
      >
        <p>{validateQuota().message}</p>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>超配额场景需提前协商扩容/分批/排期方案，协商结果留痕后方可处理。</p>
        <Table
          size="small"
          style={{ marginTop: 12 }}
          columns={[
            { title: '批次号', dataIndex: 'batchNo' },
            { title: '原因', dataIndex: 'reason', ellipsis: true },
            { title: '状态', dataIndex: 'status' },
          ]}
          dataSource={negotiationRecords}
          rowKey="id"
          pagination={false}
        />
      </Modal>
    </div>
  )
}
