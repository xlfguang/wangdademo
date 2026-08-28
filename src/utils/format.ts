import dayjs from 'dayjs'

export const formatDateTime = (date: string): string =>
  dayjs(date).format('YYYY-MM-DD HH:mm')

export const formatDate = (date: string): string =>
  dayjs(date).format('YYYY-MM-DD')

export const getGreeting = (): string => {
  const hour = dayjs().hour()
  if (hour < 12) return '上午好'
  if (hour < 18) return '下午好'
  return '晚上好'
}

export const formatNumber = (num: number): string =>
  num.toLocaleString('zh-CN')
