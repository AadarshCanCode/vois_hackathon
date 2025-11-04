export interface ProctorLog {
  userId: string;
  eventType: string;
  metadata: Record<string, unknown>;
  timestamp: string;
}

export interface ModelAvailabilityResult {
  cascade: boolean;
  faceApiDir: boolean;
  manifest: boolean;
  shard: boolean;
  cascadeSize: number;
  shardSize: number;
}

export interface AdminStatus {
  allowlist: string[];
  updatedAt: string;
}
