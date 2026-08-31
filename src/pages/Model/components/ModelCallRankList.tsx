import { Progress } from 'antd'
import type { ModelCallRankItem } from '@/mock/model'
import { modelCallRankColors } from '@/mock/model'
import { formatNumber } from '@/utils/format'
import styles from '../index.module.css'

interface ModelCallRankListProps {
  items: ModelCallRankItem[]
}

export default function ModelCallRankList({ items }: ModelCallRankListProps) {
  const maxCount = items[0]?.callCount ?? 1

  return (
    <div className={styles.rankList}>
      {items.map((item, index) => {
        const color = modelCallRankColors[index] ?? modelCallRankColors[0]
        return (
          <div key={item.modelId} className={styles.rankItem}>
            <div className={styles.rankBadge} style={{ background: color }}>
              {item.rank}
            </div>
            <div className={styles.rankBody}>
              <div className={styles.rankMeta}>
                <span className={styles.rankName}>{item.modelName}</span>
                <span className={styles.rankStats}>
                  <span className={styles.rankCount}>{formatNumber(item.callCount)} 次</span>
                  <span className={styles.rankPercent}>{item.percentage}%</span>
                </span>
              </div>
              <Progress
                percent={(item.callCount / maxCount) * 100}
                showInfo={false}
                strokeColor={color}
                trailColor="#f0f2f5"
                size="small"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
