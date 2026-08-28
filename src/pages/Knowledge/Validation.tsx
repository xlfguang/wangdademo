import { useState, useCallback } from 'react'
import { Table, Button, Tag, Modal, Input, Tabs, message } from 'antd'
import PageHeader from '@/components/PageHeader'
import KnowledgeSubNav from './components/KnowledgeSubNav'
import { useKnowledgeContext } from './KnowledgeContext'
import { useDeepLinkAction } from '@/utils/deepLink'
import { delay } from '@/utils/mockApi'
import type { ValidationRecord } from '@/types'

const statusMap = {
  pending: { color: 'orange', label: '待审核' },
  approved: { color: 'green', label: '已通过' },
  rejected: { color: 'red', label: '已驳回' },
}

export default function Validation() {
  const { validationRecords, updateValidation } = useKnowledgeContext()
  const [activeTab, setActiveTab] = useState('pending')
  const [modalOpen, setModalOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<ValidationRecord | null>(null)
  const [action, setAction] = useState<'approve' | 'reject'>('approve')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const filtered = validationRecords.filter((r) => {
    if (activeTab === 'all') return true
    return r.status === activeTab
  })

  const openReview = (record: ValidationRecord, act: 'approve' | 'reject') => {
    setCurrentRecord(record)
    setAction(act)
    setComment('')
    setModalOpen(true)
  }

  useDeepLinkAction('review', useCallback(() => {
    const pending = validationRecords.find((r) => r.status === 'pending')
    if (pending) openReview(pending, 'approve')
  }, [validationRecords]))

  const handleSubmit = async () => {
    if (!currentRecord) return
    setLoading(true)
    await delay(400)
    const now = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
    updateValidation(currentRecord.id, {
      status: action === 'approve' ? 'approved' : 'rejected',
      reviewer: '管理员',
      reviewTime: now,
      comment: comment || (action === 'approve' ? '审核通过' : '审核驳回'),
    })
    setLoading(false)
    setModalOpen(false)
    message.success(action === 'approve' ? '已通过审核' : '已驳回')
  }

  const columns = [
    { title: '文档名称', dataIndex: 'docName', key: 'docName', ellipsis: true },
    { title: '所属知识库', dataIndex: 'kbName', key: 'kbName' },
    { title: '提交人', dataIndex: 'submitter', key: 'submitter' },
    { title: '提交时间', dataIndex: 'submitTime', key: 'submitTime' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (s: ValidationRecord['status']) => {
        const cfg = statusMap[s]
        return <Tag color={cfg.color}>{cfg.label}</Tag>
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: ValidationRecord) => (
        record.status === 'pending' ? (
          <>
            <Button type="link" size="small" onClick={() => openReview(record, 'approve')}>通过</Button>
            <Button type="link" size="small" danger onClick={() => openReview(record, 'reject')}>驳回</Button>
          </>
        ) : (
          <Button type="link" size="small" onClick={() => message.info(record.comment ?? '无审核意见')}>查看意见</Button>
        )
      ),
    },
  ]

  return (
    <div>
      <KnowledgeSubNav />
      <PageHeader title="内容审核" description="文档入库前的审核工作流，确保知识内容准确合规" />
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          { key: 'pending', label: `待审核 (${validationRecords.filter((r) => r.status === 'pending').length})` },
          { key: 'approved', label: '已通过' },
          { key: 'rejected', label: '已驳回' },
          { key: 'all', label: '全部' },
        ]}
        style={{ marginBottom: 16 }}
      />
      <Table columns={columns} dataSource={filtered} rowKey="id" pagination={{ pageSize: 10 }} />
      <Modal
        title={action === 'approve' ? '通过审核' : '驳回审核'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        confirmLoading={loading}
      >
        {currentRecord && (
          <div style={{ marginBottom: 12 }}>
            <p><strong>文档：</strong>{currentRecord.docName}</p>
            <p><strong>内容摘要：</strong>{currentRecord.content}</p>
          </div>
        )}
        <Input.TextArea
          rows={3}
          placeholder="请输入审核意见（可选）"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </Modal>
    </div>
  )
}
