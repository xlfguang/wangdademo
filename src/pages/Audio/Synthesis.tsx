import { useState, useCallback } from 'react'
import { Row, Col, Card, Button, Slider, Input, Progress, message, Space, Tag, Upload, List } from 'antd'
import { SoundOutlined, DownloadOutlined, PlayCircleOutlined, UploadOutlined } from '@ant-design/icons'
import PageHeader from '@/components/PageHeader'
import AudioSubNav from './components/AudioSubNav'
import { useMenuData } from '@/mock/useMenuData'
import type { AudioData } from '@/mock/audio'
import { useDeepLinkParam } from '@/utils/deepLink'
import { delay } from '@/utils/mockApi'

export default function Synthesis() {
  const { data } = useMenuData<AudioData>('audio')
  const { voiceProfiles, synthesisScenarios, synthesisHistory } = data
  const [selectedVoice, setSelectedVoice] = useState('v1')
  const [speed, setSpeed] = useState(1.0)
  const [pitch, setPitch] = useState(0)
  const [text, setText] = useState(synthesisScenarios.meeting.template)
  const [scenario, setScenario] = useState('meeting')
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [progress, setProgress] = useState(0)

  useDeepLinkParam('scenario', useCallback((value: string) => {
    const s = synthesisScenarios[value]
    if (s) {
      setScenario(value)
      setText(s.template)
      message.info(`已加载场景模板：${s.title}`)
    }
  }, []))

  const handleScenario = (key: string) => {
    setScenario(key)
    setText(synthesisScenarios[key].template)
  }

  const handleGenerate = async () => {
    if (!text.trim()) {
      message.warning('请输入合成文本')
      return
    }
    setGenerating(true)
    setGenerated(false)
    setProgress(0)
    for (let i = 0; i <= 100; i += 20) {
      setProgress(i)
      await delay(300)
    }
    setGenerating(false)
    setGenerated(true)
    message.success('语音合成完成')
  }

  return (
    <div>
      <AudioSubNav />
      <PageHeader title="语音合成" description="个性化语音合成 — 语速、音调、音色与场景模板（演示模式）" />
      <Row gutter={16}>
        <Col span={14}>
          <Card title="合成配置" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 500, marginBottom: 8 }}>场景模板</div>
              <Space wrap>
                {Object.entries(synthesisScenarios).map(([key, s]) => (
                  <Tag
                    key={key}
                    color={scenario === key ? 'blue' : 'default'}
                    style={{ cursor: 'pointer', padding: '4px 12px' }}
                    onClick={() => handleScenario(key)}
                  >
                    {s.title}
                  </Tag>
                ))}
              </Space>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 500, marginBottom: 8 }}>合成文本</div>
              <Input.TextArea rows={5} value={text} onChange={(e) => setText(e.target.value)} placeholder="输入要合成的文本..." />
            </div>
            <Row gutter={24}>
              <Col span={12}>
                <div style={{ marginBottom: 8 }}>语速 {speed.toFixed(1)}x</div>
                <Slider min={0.5} max={2} step={0.1} value={speed} onChange={setSpeed} />
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 8 }}>音调 {pitch > 0 ? `+${pitch}` : pitch}</div>
                <Slider min={-12} max={12} value={pitch} onChange={setPitch} />
              </Col>
            </Row>
            <Button type="primary" icon={<SoundOutlined />} loading={generating} onClick={handleGenerate} style={{ marginTop: 16 }}>
              生成试听
            </Button>
          </Card>
          {(generating || generated) && (
            <Card title="试听" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
              {generating && <Progress percent={progress} style={{ marginBottom: 16 }} />}
              {generated && (
                <>
                  <div style={{ height: 60, background: 'linear-gradient(90deg, #1677ff 0%, #69b1ff 50%, #1677ff 100%)', borderRadius: 8, opacity: 0.3, marginBottom: 16 }} />
                  <Space>
                    <Button icon={<PlayCircleOutlined />} onClick={() => message.info('播放 mock 音频')}>试听</Button>
                    <Button icon={<DownloadOutlined />} onClick={() => message.success('MP3 已下载（演示）')}>下载 MP3</Button>
                  </Space>
                </>
              )}
            </Card>
          )}
        </Col>
        <Col span={10}>
          <Card title="音色选择" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
            {voiceProfiles.map((v) => (
              <div
                key={v.id}
                onClick={() => setSelectedVoice(v.id)}
                style={{
                  padding: '12px 16px',
                  marginBottom: 8,
                  borderRadius: 8,
                  cursor: 'pointer',
                  border: selectedVoice === v.id ? '2px solid #1677ff' : '1px solid var(--color-border)',
                  background: selectedVoice === v.id ? 'rgba(22,119,255,0.04)' : '#fff',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{v.name}</strong>
                  {v.tag && <Tag color="blue">{v.tag}</Tag>}
                </div>
                <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 4 }}>{v.desc}</div>
                {v.id === 'v4' && selectedVoice === 'v4' && (
                  <Upload accept="audio/*" showUploadList={false} beforeUpload={() => { message.success('样本已上传（演示）'); return false }}>
                    <Button size="small" icon={<UploadOutlined />} style={{ marginTop: 8 }}>上传 10s 样本</Button>
                  </Upload>
                )}
              </div>
            ))}
          </Card>
          <Card title="最近合成" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
            <List
              size="small"
              dataSource={synthesisHistory}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.text}
                    description={`${item.voice} · ${item.duration} · ${item.createdAt}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
