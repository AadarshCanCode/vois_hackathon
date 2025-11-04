import fs from 'node:fs';
import path from 'node:path';
import { ModelAvailabilityResult } from '../models/adminModel.js';

export function checkModelAvailability(): ModelAvailabilityResult {
  const modelsPath = path.join(process.cwd(), 'public', 'models');
  const cascadePath = path.join(modelsPath, 'haarcascade_frontalface_default.xml');
  const faceApiPath = path.join(modelsPath, 'face-api');
  const manifestPath = path.join(faceApiPath, 'tiny_face_detector_model-weights_manifest.json');
  const shardPath = path.join(faceApiPath, 'tiny_face_detector_model-shard1');

  return new ModelAvailabilityResult({
    cascade: fs.existsSync(cascadePath),
    faceApiDir: fs.existsSync(faceApiPath),
    manifest: fs.existsSync(manifestPath),
    shard: fs.existsSync(shardPath),
    cascadeSize: fs.existsSync(cascadePath) ? fs.statSync(cascadePath).size : 0,
    shardSize: fs.existsSync(shardPath) ? fs.statSync(shardPath).size : 0
  });
}