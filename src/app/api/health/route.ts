import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import mongoose from 'mongoose'

export async function GET() {
  const start = Date.now()

  let dbStatus = 'disconnected'
  let dbLatency = 0

  try {
    await connectDB()
    const dbStart = Date.now()
    await mongoose.connection.db?.admin().ping()
    dbLatency = Date.now() - dbStart
    dbStatus = 'connected'
  } catch {
    dbStatus = 'error'
  }

  const status = dbStatus === 'connected' ? 200 : 503
  const totalLatency = Date.now() - start

  return NextResponse.json(
    {
      status: status === 200 ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      latency: `${totalLatency}ms`,
      services: {
        database: {
          status: dbStatus,
          latency: `${dbLatency}ms`,
        },
        api: { status: 'ok' },
      },
      version: process.env.npm_package_version ?? '1.0.0',
    },
    { status }
  )
}
