import { ProctorLog } from '../models/adminModel.mjs';

export function recordProctorLog(payload) {
  const log = new ProctorLog(payload);
  console.log('[PROCTOR-LOG]', log.timestamp, JSON.stringify(log));
  return { ok: true };
}
