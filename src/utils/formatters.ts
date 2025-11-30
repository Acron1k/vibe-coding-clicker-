export const formatNumber = (num: number): string => {
  if (num < 0) return '-' + formatNumber(-num)
  if (num < 1) return num.toFixed(1)
  if (num < 10) return num.toFixed(1)
  if (num < 1000) return Math.floor(num).toString()
  if (num < 1_000_000) return (num / 1000).toFixed(1) + 'K'
  if (num < 1_000_000_000) return (num / 1_000_000).toFixed(2) + 'M'
  if (num < 1_000_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B'
  return (num / 1_000_000_000_000).toFixed(2) + 'T'
}

export const formatPerSecond = (rate: number): string => {
  if (rate === 0) return '0/s'
  if (rate < 0.1) return rate.toFixed(2) + '/s'
  if (rate < 1) return rate.toFixed(1) + '/s'
  return formatNumber(rate) + '/s'
}

export const formatTime = (seconds: number): string => {
  if (seconds < 60) return `${Math.floor(seconds)}s`
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}m ${secs}s`
  }
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${mins}m`
}

export const formatCompact = (num: number): string => {
  if (num < 1000) return num.toString()
  if (num < 1_000_000) return (num / 1000).toFixed(0) + 'K'
  if (num < 1_000_000_000) return (num / 1_000_000).toFixed(1) + 'M'
  return (num / 1_000_000_000).toFixed(1) + 'B'
}
