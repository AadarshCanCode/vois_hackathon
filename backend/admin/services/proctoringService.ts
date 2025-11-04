import { ProctorLog, ProctorLogData } from '../models/adminModel.js';

export function recordProctorLog(payload: ProctorLogData): { ok: boolean } {
  const log = new ProctorLog(payload);
  console.log('[PROCTOR-LOG]', log.timestamp, JSON.stringify(log));
  return { ok: true };
}