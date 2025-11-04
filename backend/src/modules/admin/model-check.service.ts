import fs from 'node:fs';
import path from 'node:path';
import type { ModelAvailabilityResult } from './admin.types';

export function checkModelAvailability(): ModelAvailabilityResult {
  const modelsPath = path.join(process.cwd(), 'public', 'models');
  const cascadePath = path.join(modelsPath, 'haarcascade_frontalface_default.xml');
  const faceApiPath = path.join(modelsPath, 'face-api');
  const manifestPath = path.join(faceApiPath, 'tiny_face_detector_model-weights_manifest.json');
  const shardPath = path.join(faceApiPath, 'tiny_face_detector_model-shard1');

  const cascadeExists = fs.existsSync(cascadePath);
  const shardExists = fs.existsSync(shardPath);

  return {
    cascade: cascadeExists,
    faceApiDir: fs.existsSync(faceApiPath),
    manifest: fs.existsSync(manifestPath),
    shard: shardExists,
    cascadeSize: cascadeExists ? fs.statSync(cascadePath).size : 0,
    shardSize: shardExists ? fs.statSync(shardPath).size : 0
  };
}
