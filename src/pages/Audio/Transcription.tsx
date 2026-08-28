import { useState, useEffect, useMemo } from 'react'
import { Row, Col, Card, Checkbox, Button, Progress, Timeline, Input, Switch, Form, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import AudioSubNav from './components/AudioSubNav'
import { useAudioContext, transcriptMock } from './AudioContext'
import { delay } from '@/utils/mockApi'
import styles from './index.module.css'

const { TextArea } = Input

export default function Transcription() {
  const navigate = useNavigate()
  const { clips, transcript, setTranscript, transcriptText, setTranscriptText } = useAudioContext()
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [multiSpeaker, setMultiSpeaker] = useState(true)

  const clipOptions = useMemo(
    () => (clips.length > 0
      ? clips.map((c) => ({ label: `${c.name} (${c.duration})`, value: c.id }))
      : [{ label: '完整音频', value: 'full' }]),
    [clips],
  )

  useEffect(() => {
    setSelected(clipOptions.map((o) => o.value))
  }, [clipOptions])

  const handleRecognize = async () => {
    if (selected.length === 0) {
      message.warning('请选择待识别片段')
      return
    }
    setLoading(true)
    setProgress(0)
    for (let i = 0; i <= 100; i += 25) {
      setProgress(i)
      await delay(500)
    }
    setTranscript(transcriptMock)
    setTranscriptText(transcriptMock.map((s) => `[${s.timestamp}] ${s.speaker}：${s.text}`).join('\n\n'))
    setLoading(false)
    message.success('语音转文字完成')
  }

  return (
    <div>
      <AudioSubNav />
      <PageHeader title="语音转文字" description="对裁剪后的音频片段进行语音识别，生成结构化文字" />
      <Row gutter={16}>
        <Col span={8}>
          <Card title="识别配置" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
            <Form layout="vertical">
              <Form.Item label="待识别片段">
                <Checkbox.Group
                  options={clipOptions}
                  value={selected}
                  onChange={(v) => setSelected(v as string[])}
                />
              </Form.Item>
              <Form.Item label="识别语言"><Input value="中文（普通话）" readOnly /></Form.Item>
              <Form.Item label="多说话人区分"><Switch checked={multiSpeaker} onChange={setMultiSpeaker} /></Form.Item>
              <Button type="primary" block loading={loading} onClick={handleRecognize}>开始识别</Button>
              {loading && <Progress percent={progress} style={{ marginTop: 12 }} format={(p) => `处理中... ${p}%`} />}
            </Form>
          </Card>
        </Col>
        <Col span={16}>
          <Card title="识别结果" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }} extra={
            transcript.length > 0 && <Button type="primary" onClick={() => navigate('/audio/extraction')}>提取关键信息</Button>
          }>
            {transcript.length > 0 ? (
              <>
                <Timeline items={transcript.map((s) => ({
                  children: (
                    <div>
                      <span style={{ color: '#1677ff', marginRight: 8 }}>{s.timestamp}</span>
                      {multiSpeaker && <span style={{ color: '#7c5cfc', marginRight: 8 }}>{s.speaker}</span>}
                      {s.text}
                    </div>
                  ),
                }))} />
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>编辑文本</div>
                  <TextArea rows={8} value={transcriptText} onChange={(e) => setTranscriptText(e.target.value)} />
                  <Button style={{ marginTop: 8 }} onClick={() => message.success('编辑结果已保存')}>保存编辑</Button>
                </div>
              </>
            ) : (
              <div className={styles.aiPanel} style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                选择片段后点击「开始识别」查看转写结果
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}
