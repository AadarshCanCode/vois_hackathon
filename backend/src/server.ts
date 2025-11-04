import { app } from './app';
import { env } from './config/env';
import { assertSupabaseConnection } from './lib/supabase-client';

const PORT = env.port;

async function startServer() {
  try {
    if (env.nodeEnv !== 'test') {
      await assertSupabaseConnection();
    }
  } catch (error) {
    console.error('[Startup] Supabase connectivity check failed:', error);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

void startServer();
