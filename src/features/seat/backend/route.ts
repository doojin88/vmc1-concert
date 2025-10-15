import type { Hono } from 'hono';
import { respond, failure } from '@/backend/http/response';
import { getLogger, getSupabase, type AppEnv } from '@/backend/hono/context';
import { SeatParamsSchema } from './schema';
import { listSeats } from './service';
import { seatErrorCodes } from './error';

export const registerSeatRoutes = (app: Hono<AppEnv>) => {
  app.get('/concerts/:concertId/seats', async (c) => {
    const parsedParams = SeatParamsSchema.safeParse({
      concertId: c.req.param('concertId'),
    });

    if (!parsedParams.success) {
      return respond(
        c,
        failure(
          400,
          seatErrorCodes.invalidParams,
          'Invalid concert ID',
          parsedParams.error.format()
        )
      );
    }

    const supabase = getSupabase(c);
    const logger = getLogger(c);

    const result = await listSeats(supabase, parsedParams.data.concertId);

    if (!result.ok) {
      logger.error('Failed to fetch seats', result.error.message);
    }

    return respond(c, result);
  });
};

