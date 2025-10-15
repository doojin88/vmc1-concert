import type { Hono } from 'hono';
import { respond } from '@/backend/http/response';
import { getLogger, getSupabase, type AppEnv } from '@/backend/hono/context';
import { listConcerts } from './service';

export const registerConcertRoutes = (app: Hono<AppEnv>) => {
  app.get('/concerts', async (c) => {
    const supabase = getSupabase(c);
    const logger = getLogger(c);

    const result = await listConcerts(supabase);

    if (!result.ok) {
      logger.error('Failed to fetch concerts', result.error.message);
    }

    return respond(c, result);
  });
};

