import { Form, Input, Select, DatePicker, Button, Space } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import type { SearchParams } from '@/types'

const { RangePicker } = DatePicker

interface SearchFormProps {
  onSearch: (params: SearchParams) => void
  statusOptions?: { label: string; value: string }[]
}

export default function SearchForm({ onSearch, statusOptions }: SearchFormProps) {
  const [form] = Form.useForm()

  const handleSearch = () => {
    const values = form.getFieldsValue()
    onSearch({
      keyword: values.keyword,
      status: values.status,
      dateRange: values.dateRange
        ? [values.dateRange[0].format('YYYY-MM-DD'), values.dateRange[1].format('YYYY-MM-DD')]
        : null,
    })
  }

  const handleReset = () => {
    form.resetFields()
    onSearch({})
  }

  return (
    <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
      <Form.Item name="keyword">
        <Input placeholder="关键词搜索" prefix={<SearchOutlined />} allowClear style={{ width: 220 }} />
      </Form.Item>
      {statusOptions && (
        <Form.Item name="status">
          <Select placeholder="状态筛选" allowClear style={{ width: 140 }} options={statusOptions} />
        </Form.Item>
      )}
      <Form.Item name="dateRange">
        <RangePicker placeholder={['开始日期', '结束日期']} />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" onClick={handleSearch}>搜索</Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>重置</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}
