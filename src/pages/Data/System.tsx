import { Row, Col, Card, Table, Tree } from 'antd'
import StatusTag from '@/components/StatusTag'
import DataSubNav from './components/DataSubNav'
import { systemUsers, permissionTree } from '@/mock/data'

export default function System() {
  const columns = [
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '角色', dataIndex: 'role', key: 'role' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <StatusTag status={s === 'completed' ? 'completed' : s === 'running' ? 'running' : 'waiting'} /> },
    { title: '最近登录', dataIndex: 'lastLogin', key: 'lastLogin' },
  ]

  return (
    <div>
      <DataSubNav />
      <Row gutter={16}>
        <Col span={14}>
          <Card title="用户管理" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
            <Table columns={columns} dataSource={systemUsers} rowKey="id" pagination={false} size="middle" />
          </Card>
        </Col>
        <Col span={10}>
          <Card title="权限管理" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
            <Tree defaultExpandAll treeData={permissionTree} checkable defaultCheckedKeys={['sources', 'governance', 'analysis', 'reports', 'quality']} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
