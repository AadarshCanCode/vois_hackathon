export interface ProctorLogData {
  userId?: string;
  eventType?: string;
  metadata?: Record<string, unknown>;
  timestamp?: string;
}

export interface ModelAvailabilityResultData {
  cascade: boolean;
  faceApiDir: boolean;
  manifest: boolean;
  shard: boolean;
  cascadeSize?: number;
  shardSize?: number;
}

export interface AdminStatusData {
  allowlist: string[];
  updatedAt?: string;
}

export class ProctorLog {
  userId: string;
  eventType: string;
  metadata: Record<string, unknown>;
  timestamp: string;

  constructor({ userId = 'unknown', eventType = 'generic', metadata = {}, timestamp = new Date().toISOString() }: ProctorLogData = {}) {
    this.userId = userId;
    this.eventType = eventType;
    this.metadata = metadata;
    this.timestamp = timestamp;
  }
}

export class ModelAvailabilityResult {
  cascade: boolean;
  faceApiDir: boolean;
  manifest: boolean;
  shard: boolean;
  cascadeSize: number;
  shardSize: number;

  constructor({ cascade, faceApiDir, manifest, shard, cascadeSize = 0, shardSize = 0 }: ModelAvailabilityResultData) {
    this.cascade = cascade;
    this.faceApiDir = faceApiDir;
    this.manifest = manifest;
    this.shard = shard;
    this.cascadeSize = cascadeSize;
    this.shardSize = shardSize;
  }
}

export class AdminStatus {
  allowlist: string[];
  updatedAt: string;

  constructor({ allowlist }: AdminStatusData) {
    this.allowlist = allowlist;
    this.updatedAt = new Date().toISOString();
  }
}