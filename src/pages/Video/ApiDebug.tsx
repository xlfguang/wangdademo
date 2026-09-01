import { useState } from 'react'
import { Menu, Input, Button, Tag, Typography, Spin } from 'antd'
import VideoSubNav from './components/VideoSubNav'
import { useMenuData } from '@/mock/useMenuData'
import type { VideoData } from '@/mock/video'
import { delay } from '@/utils/mockApi'
import styles from './index.module.css'

const { TextArea } = Input
const { Paragraph } = Typography

export default function ApiDebug() {
  const { data } = useMenuData<VideoData>('video')
  const videoApiEndpoints = data.videoApiEndpoints
  const [selected, setSelected] = useState(videoApiEndpoints[0])
  const [requestBody, setRequestBody] = useState(selected.requestBody)
  const [response, setResponse] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSelect = (id: string) => {
    const endpoint = videoApiEndpoints.find((e) => e.id === id)!
    setSelected(endpoint)
    setRequestBody(endpoint.requestBody)
    setResponse(null)
  }

  const handleSend = async () => {
    setLoading(true)
    setResponse(null)
    await delay(500)
    setResponse(selected.responseBody)
    setLoading(false)
  }

  return (
    <div>
      <VideoSubNav />
      <div className={styles.apiLayout}>
        <div className={styles.apiMenu}>
          <Menu
            mode="inline"
            selectedKeys={[selected.id]}
            items={videoApiEndpoints.map((e) => ({ key: e.id, label: e.name }))}
            onClick={({ key }) => handleSelect(key)}
            style={{ border: 'none', height: '100%' }}
          />
        </div>
        <div className={styles.apiContent}>
          <div style={{ marginBottom: 16 }}>
            <Tag color="blue">{selected.method}</Tag>
            <span style={{ fontFamily: 'monospace', fontSize: 15 }}>{selected.path}</span>
          </div>
          <div style={{ marginBottom: 8, fontWeight: 600 }}>请求参数 JSON Body</div>
          <TextArea
            rows={10}
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            style={{ fontFamily: 'monospace', fontSize: 13 }}
          />
          <Button type="primary" loading={loading} onClick={handleSend} style={{ marginTop: 16 }}>
            发送请求
          </Button>
          {loading && <Spin style={{ marginLeft: 16 }} />}
          {response && (
            <div>
              <div style={{ marginTop: 20, marginBottom: 8, fontWeight: 600 }}>Response</div>
              <div className={styles.responseBlock}>
                <Paragraph copyable={{ text: response }} style={{ color: '#e2e8f0', margin: 0 }}>
                  {response}
                </Paragraph>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
