import type { Hono } from 'hono';
import { respond, failure } from '@/backend/http/response';
import { getLogger, getSupabase, type AppEnv } from '@/backend/hono/context';
import { CreateReservationSchema } from './schema';
import { createReservation } from './service';
import { reservationErrorCodes } from './error';

export const registerReservationRoutes = (app: Hono<AppEnv>) => {
  app.post('/reservations', async (c) => {
    const body = await c.req.json();
    const parsedBody = CreateReservationSchema.safeParse(body);

    if (!parsedBody.success) {
      return respond(
        c,
        failure(
          400,
          reservationErrorCodes.invalidParams,
          'Invalid request body',
          parsedBody.error.format()
        )
      );
    }

    const supabase = getSupabase(c);
    const logger = getLogger(c);

    const result = await createReservation(supabase, parsedBody.data);

    if (!result.ok) {
      logger.error('Failed to create reservation', result.error.message);
    }

    return respond(c, result);
  });
};

