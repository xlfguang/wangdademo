import { useState, useEffect, useRef, type ReactNode } from 'react'
import { Card, Button, Progress, Tag, message, Select } from 'antd'
import { PlayCircleOutlined, CheckCircleOutlined, SyncOutlined, ClockCircleOutlined } from '@ant-design/icons'
import DataCleanSubNav from './components/DataCleanSubNav'
import { useMenuData } from '@/mock/useMenuData'
import type { DataCleanData } from '@/mock/dataClean'
import type { PipelineStep } from '@/types'
import styles from './index.module.css'

const statusIcon: Record<string, ReactNode> = {
  completed: <CheckCircleOutlined style={{ color: '#22c55e' }} />,
  running: <SyncOutlined spin style={{ color: '#1677ff' }} />,
  pending: <ClockCircleOutlined style={{ color: '#94a3b8' }} />,
  failed: <ClockCircleOutlined style={{ color: '#ff4d4f' }} />,
}

const statusTag: Record<string, string> = {
  completed: 'success',
  running: 'processing',
  pending: 'default',
  failed: 'error',
}

const statusLabel: Record<string, string> = {
  completed: '已完成',
  running: '执行中',
  pending: '待执行',
  failed: '失败',
}

export default function Pipeline() {
  const { data } = useMenuData<DataCleanData>('dataClean')
  const { pipelineLayers: initialLayers, cleanBatches } = data
  const [selectedBatch, setSelectedBatch] = useState(cleanBatches[0].id)
  const [steps, setSteps] = useState<PipelineStep[]>(initialLayers.map((s) => ({ ...s })))
  const [executing, setExecuting] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const batch = cleanBatches.find((b) => b.id === selectedBatch) ?? cleanBatches[0]

  const overallProgress = Math.round(steps.reduce((sum, s) => sum + s.progress, 0) / steps.length)

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  const handleExecute = () => {
    if (executing) return
    setExecuting(true)
    setSteps(initialLayers.map((s, i) => ({ ...s, status: i === 0 ? 'running' : 'pending', progress: 0 })))
    message.info('流水线开始执行')

    let layerIndex = 0
    timerRef.current = setInterval(() => {
      setSteps((prev) => {
        const next = prev.map((s) => ({ ...s }))
        const current = next[layerIndex]
        if (!current) return prev

        if (current.progress < 100) {
          current.progress = Math.min(100, current.progress + 8)
          current.status = 'running'
          return next
        }

        current.status = 'completed'
        layerIndex += 1
        if (layerIndex < next.length) {
          next[layerIndex].status = 'running'
        } else {
          if (timerRef.current) clearInterval(timerRef.current)
          setExecuting(false)
          message.success('六层流水线执行完成')
        }
        return next
      })
    }, 400)
  }

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setExecuting(false)
    setSteps(initialLayers.map((s) => ({ ...s })))
  }

  const handleBatchChange = (batchId: string) => {
    if (executing) return
    setSelectedBatch(batchId)
    handleReset()
    message.info(`已切换至批次：${cleanBatches.find((b) => b.id === batchId)?.name}`)
  }

  return (
    <div>
      <DataCleanSubNav />
      <Card bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontWeight: 500 }}>绑定批次</span>
            <Select
              value={selectedBatch}
              onChange={handleBatchChange}
              style={{ width: 280 }}
              options={cleanBatches.map((b) => ({ label: `${b.name} (${b.batchNo})`, value: b.id }))}
              disabled={executing}
            />
            <Tag color="blue">{batch.status === 'running' ? '运行中' : batch.status === 'completed' ? '已完成' : '排队中'}</Tag>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button icon={<PlayCircleOutlined />} type="primary" loading={executing} onClick={handleExecute}>执行流水线</Button>
            <Button onClick={handleReset} disabled={executing}>重置</Button>
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>整体进度 — {batch.name}</div>
          <Progress percent={overallProgress} style={{ width: '100%', maxWidth: 400 }} />
        </div>
      </Card>
      {steps.map((step) => (
        <div
          key={step.id}
          className={`${styles.pipelineLayer} ${step.status === 'running' ? styles.pipelineLayerActive : ''} ${step.status === 'completed' ? styles.pipelineLayerDone : ''}`}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {statusIcon[step.status]}
              <strong>{step.layer}：{step.name}</strong>
              <Tag color={statusTag[step.status]}>{statusLabel[step.status]}</Tag>
            </div>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>{step.progress}%</span>
          </div>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginBottom: 8 }}>{step.description}</div>
          <Progress percent={step.progress} size="small" showInfo={false} strokeColor={step.status === 'completed' ? '#22c55e' : '#1677ff'} />
        </div>
      ))}
    </div>
  )
}
