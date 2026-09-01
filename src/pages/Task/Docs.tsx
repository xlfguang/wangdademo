import { useState } from 'react'
import { Card, Table, Upload, Select, Button, List, Row, Col, message } from 'antd'
import { UploadOutlined, CommentOutlined } from '@ant-design/icons'
import PageHeader from '@/components/PageHeader'
import TaskSubNav from './components/TaskSubNav'
import { useMenuData } from '@/mock/useMenuData'
import type { TaskData } from '@/mock/task'
import { delay } from '@/utils/mockApi'

export default function Docs() {
  const { data } = useMenuData<TaskData>('task')
  const { taskDocuments, taskComments } = data
  const [folder, setFolder] = useState<string | undefined>()
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null)

  const filtered = folder ? taskDocuments.filter((d) => d.folder === folder) : taskDocuments
  const comments = selectedDoc ? taskComments.filter((c) => c.docId === selectedDoc) : []

  const columns = [
    { title: '文件名', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '所属任务', dataIndex: 'taskId', key: 'taskId' },
    { title: '目录', dataIndex: 'folder', key: 'folder' },
    { title: '大小', dataIndex: 'size', key: 'size' },
    { title: '更新人', dataIndex: 'updatedBy', key: 'updatedBy' },
    { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt' },
    { title: '操作', key: 'action', render: (_: unknown, r: typeof taskDocuments[0]) => (
      <Button type="link" size="small" onClick={() => setSelectedDoc(r.id)}>批注</Button>
    ) },
  ]

  return (
    <div>
      <TaskSubNav />
      <PageHeader title="文档协作共享" description="任务专属资料夹，支持上传、在线编辑与批注" />
      <Card title="资料上传" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
        <Upload beforeUpload={async (file) => { await delay(500); message.success(`${file.name} 上传成功`); return false }} showUploadList={false}>
          <Button icon={<UploadOutlined />}>上传文件</Button>
        </Upload>
        <Select placeholder="选择目录" allowClear style={{ width: 160, marginLeft: 12 }} onChange={setFolder} options={['原始素材', '阶段性成果', '中间版本', '最终成果'].map((v) => ({ label: v, value: v }))} />
      </Card>
      <Row gutter={16}>
        <Col span={selectedDoc ? 14 : 24}>
          <Card title="任务资料列表" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
            <Table columns={columns} dataSource={filtered} rowKey="id" size="small" pagination={{ pageSize: 6 }} />
          </Card>
        </Col>
        {selectedDoc && (
          <Col span={10}>
            <Card title="批注评论" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }} extra={<CommentOutlined />}>
              <List dataSource={comments} renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta title={<span>{item.author} · {item.time}</span>} description={item.content} />
                </List.Item>
              )} />
              <Button block style={{ marginTop: 12 }} onClick={() => message.success('批注已添加')}>添加批注</Button>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  )
}