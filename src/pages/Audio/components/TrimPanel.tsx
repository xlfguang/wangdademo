import { useState } from 'react'
import { Form, Input, Slider, Button, List, message } from 'antd'
import { formatAudioDuration } from '@/utils/audioFile'
import { generateId } from '@/utils/mockApi'
import type { AudioClip } from '@/types'
import styles from '../index.module.css'

interface TrimPanelProps {
  durationSec: number
  clips: AudioClip[]
  onAddClip: (clip: AudioClip) => void
  onRemoveClip: (id: string) => void
}

export default function TrimPanel({ durationSec, clips, onAddClip, onRemoveClip }: TrimPanelProps) {
  const [range, setRange] = useState<[number, number]>([0, Math.min(60, durationSec || 60)])
  const [clipName, setClipName] = useState('')

  const handleConfirm = () => {
    const [start, end] = range
    if (start >= end) {
      message.error('开始时间必须小于结束时间')
      return
    }
    if (durationSec && end > durationSec) {
      message.error('结束时间超出音频时长')
      return
    }
    onAddClip({
      id: generateId(),
      name: clipName || `片段 ${clips.length + 1}`,
      startSec: start,
      endSec: end,
      duration: formatAudioDuration(end - start),
    })
    setClipName('')
    message.success('裁剪片段已添加')
  }

  const max = durationSec || 300

  return (
    <div>
      <Form layout="vertical">
        <Form.Item label="片段名称"><Input placeholder="可选" value={clipName} onChange={(e) => setClipName(e.target.value)} /></Form.Item>
        <Form.Item label={`选取范围（0 - ${formatAudioDuration(max)}）`}>
          <Slider range min={0} max={max} value={range} onChange={(v) => setRange(v as [number, number])} tooltip={{ formatter: (v) => formatAudioDuration(v ?? 0) }} />
        </Form.Item>
        <div className={styles.trimActions}>
          <Input addonBefore="开始" value={formatAudioDuration(range[0])} readOnly style={{ width: 140 }} />
          <Input addonBefore="结束" value={formatAudioDuration(range[1])} readOnly style={{ width: 140 }} />
          <Button type="primary" onClick={handleConfirm}>确认裁剪</Button>
          <Button onClick={() => setRange([0, Math.min(60, max)])}>重新选取</Button>
        </div>
      </Form>
      {clips.length > 0 && (
        <List
          className="clipList"
          style={{ marginTop: 16 }}
          header="已裁剪片段"
          bordered
          dataSource={clips}
          renderItem={(item) => (
            <List.Item actions={[<Button type="link" size="small" danger onClick={() => onRemoveClip(item.id)}>删除</Button>]}>
              <List.Item.Meta
                title={item.name}
                description={`${formatAudioDuration(item.startSec)} - ${formatAudioDuration(item.endSec)} · 时长 ${item.duration}`}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  )
}
