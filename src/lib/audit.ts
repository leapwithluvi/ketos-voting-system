import prisma from './prisma'
import { logger } from './logger'

interface AuditParams {
  userId?: string
  action: string
  resource: string
  resourceId?: string
  ipAddress: string
  userAgent?: string
  details?: any
}

export async function createAuditLog(params: AuditParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        resource: params.resource,
        resourceId: params.resourceId,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent ?? '',
        details: params.details,
      },
    })
  } catch (error) {
    // Audit log should never break main flow
    logger.error('Failed to create audit log', error)
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return request.headers.get('x-real-ip') ?? '127.0.0.1'
}

export function getUserAgent(request: Request): string {
  return request.headers.get('user-agent') ?? ''
}
