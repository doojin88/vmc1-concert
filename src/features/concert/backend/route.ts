import type { Hono } from 'hono';
import { respond, failure } from '@/backend/http/response';
import { getLogger, getSupabase, type AppEnv } from '@/backend/hono/context';
import { listConcerts, getConcertById } from './service';
import { ConcertParamsSchema } from './schema';
import { concertErrorCodes } from './error';

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

  app.get('/concerts/:id', async (c) => {
    const parsedParams = ConcertParamsSchema.safeParse({
      id: c.req.param('id'),
    });

    if (!parsedParams.success) {
      return respond(
        c,
        failure(
          400,
          concertErrorCodes.invalidParams,
          'Invalid concert ID',
          parsedParams.error.format()
        )
      );
    }

    const supabase = getSupabase(c);
    const logger = getLogger(c);

    const result = await getConcertById(supabase, parsedParams.data.id);

    if (!result.ok) {
      logger.error('Failed to fetch concert detail', result.error.message);
    }

    return respond(c, result);
  });
};

