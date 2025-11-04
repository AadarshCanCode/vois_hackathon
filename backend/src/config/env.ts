import { config } from 'dotenv';

config();

function requireEnv(name: string, optional = false): string | undefined {
  const value = process.env[name];
  if (!value && !optional) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 5173),
  supabaseUrl: requireEnv('SUPABASE_URL'),
  supabaseServiceRoleKey: requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
  geminiApiKey: requireEnv('GEMINI_API_KEY', true)
};
