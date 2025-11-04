import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

const DEFAULT_DEV_PORT = 5173;
const DEFAULT_BACKEND_PORT = 4000;

function parsePortNumber(value: string | undefined, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

function normalizeProxyTarget(value: string) {
  return value.trim().replace(/\/+$/, '');
}

function resolveBackendProxyTarget(env: Record<string, string>) {
  const explicitTarget = env.VITE_API_PROXY_TARGET || env.VITE_BACKEND_URL || env.BACKEND_URL;

  if (explicitTarget) {
    const normalizedTarget = normalizeProxyTarget(explicitTarget);
    if (normalizedTarget) {
      const endsWithApi = normalizedTarget.toLowerCase().endsWith('/api');
      if (endsWithApi) {
        console.warn('[vite] VITE_API_PROXY_TARGET should point to the server origin without the /api path. Stripping the suffix for proxy configuration.');
      }

      const sanitizedTarget = endsWithApi ? normalizedTarget.slice(0, -4) : normalizedTarget;
      if (sanitizedTarget) {
        return sanitizedTarget;
      }
    }
  }

  const portCandidate = env.VITE_BACKEND_PORT || env.BACKEND_PORT || env.PORT;
  const port = parsePortNumber(portCandidate, DEFAULT_BACKEND_PORT);
  return `http://localhost:${port}`;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const devServerPort = parsePortNumber(env.VITE_DEV_PORT, DEFAULT_DEV_PORT);
  const backendProxyTarget = resolveBackendProxyTarget(env);

  return {
    plugins: [react()],
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV)
    },
    resolve: {
      alias: {
        '@': resolve(rootDir, 'frontend'),
        '@frontend': resolve(rootDir, 'frontend'),
        '@student': resolve(rootDir, 'frontend/student'),
        '@teacher': resolve(rootDir, 'frontend/teacher'),
        '@admin': resolve(rootDir, 'frontend/admin'),
        '@context': resolve(rootDir, 'frontend/context'),
        '@services': resolve(rootDir, 'frontend/services'),
        '@data': resolve(rootDir, 'frontend/data'),
        '@lib': resolve(rootDir, 'frontend/lib'),
        '@styles': resolve(rootDir, 'frontend/styles'),
        '@types': resolve(rootDir, 'frontend/types')
      }
    },
    server: {
      host: env.VITE_DEV_HOST || '0.0.0.0',
      port: devServerPort,
      strictPort: true,
      proxy: {
        '/api': {
          target: backendProxyTarget,
          changeOrigin: true,
          secure: false
        }
      }
    }
  };
});
