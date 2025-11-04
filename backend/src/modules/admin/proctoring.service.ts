import type { ProctorLog } from './admin.types';

export function recordProctorLog(payload: Partial<ProctorLog>) {
  const log: ProctorLog = {
    userId: payload.userId ?? 'unknown',
    eventType: payload.eventType ?? 'generic',
    metadata: payload.metadata ?? {},
    timestamp: payload.timestamp ?? new Date().toISOString()
  };

  console.log('[PROCTOR-LOG]', log.timestamp, JSON.stringify(log));
  return { ok: true };
}
