// Simple logger compatible with Edge + Node environments
type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  data?: unknown
}

function log(level: LogLevel, message: string, data?: unknown): void {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    data,
  }

  const formatted = `[${entry.timestamp}] [${level.toUpperCase()}] ${message}`

  if (data) {
    const dataStr = typeof data === 'object' ? JSON.stringify(data, null, 2) : data
    if (level === 'error') {
      console.error(formatted, dataStr)
    } else if (level === 'warn') {
      console.warn(formatted, dataStr)
    } else {
      console.log(formatted, dataStr)
    }
  } else {
    if (level === 'error') {
      console.error(formatted)
    } else if (level === 'warn') {
      console.warn(formatted)
    } else {
      console.log(formatted)
    }
  }
}

export const logger = {
  info: (message: string, data?: unknown) => log('info', message, data),
  warn: (message: string, data?: unknown) => log('warn', message, data),
  error: (message: string, data?: unknown) => log('error', message, data),
  debug: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      log('debug', message, data)
    }
  },
}
