export class ProctorLog {
  constructor({ userId = 'unknown', eventType = 'generic', metadata = {}, timestamp = new Date().toISOString() } = {}) {
    this.userId = userId;
    this.eventType = eventType;
    this.metadata = metadata;
    this.timestamp = timestamp;
  }
}

export class ModelAvailabilityResult {
  constructor({ cascade, faceApiDir, manifest, shard, cascadeSize = 0, shardSize = 0 }) {
    this.cascade = cascade;
    this.faceApiDir = faceApiDir;
    this.manifest = manifest;
    this.shard = shard;
    this.cascadeSize = cascadeSize;
    this.shardSize = shardSize;
  }
}

export class AdminStatus {
  constructor({ allowlist }) {
    this.allowlist = allowlist;
    this.updatedAt = new Date().toISOString();
  }
}
