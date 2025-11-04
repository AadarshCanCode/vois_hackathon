import { config } from 'dotenv';

config();

function requireEnv(name: string, optional = false): string | undefined {
  const value = process.env[name];
  if (!value && !optional) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const DEFAULT_PORT = 4000;

function parsePort(input: string | undefined, fallback: number) {
  if (!input) {
    return fallback;
  }

  const parsed = Number.parseInt(input, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    console.warn(`[ENV] Invalid PORT value "${input}" provided. Falling back to ${fallback}.`);
    return fallback;
  }

  return parsed;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parsePort(process.env.PORT, DEFAULT_PORT),
  supabaseUrl: requireEnv('SUPABASE_URL'),
  supabaseServiceRoleKey: requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
  geminiApiKey: requireEnv('GEMINI_API_KEY', true)
};
