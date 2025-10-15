import type { Hono } from 'hono';
import { respond, failure, type ErrorResult } from '@/backend/http/response';
import { getLogger, getSupabase, type AppEnv } from '@/backend/hono/context';
import { CreateReservationSchema, ReservationParamsSchema, LookupReservationSchema } from './schema';
import { createReservation, getReservationByNumber, lookupReservation } from './service';
import { reservationErrorCodes, type ReservationErrorCode } from './error';

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
      const errorResult = result as ErrorResult<ReservationErrorCode, unknown>;
      logger.error('Failed to create reservation', errorResult.error.message);
    }

    return respond(c, result);
  });

  app.get('/reservations/:number', async (c) => {
    const parsedParams = ReservationParamsSchema.safeParse({
      number: c.req.param('number'),
    });

    if (!parsedParams.success) {
      return respond(
        c,
        failure(
          400,
          reservationErrorCodes.invalidParams,
          'Invalid reservation number',
          parsedParams.error.format()
        )
      );
    }

    const supabase = getSupabase(c);
    const logger = getLogger(c);

    const result = await getReservationByNumber(
      supabase,
      parsedParams.data.number
    );

    if (!result.ok) {
      const errorResult = result as ErrorResult<ReservationErrorCode, unknown>;
      logger.error('Failed to fetch reservation', errorResult.error.message);
    }

    return respond(c, result);
  });

  app.post('/reservations/lookup', async (c) => {
    const body = await c.req.json();
    const parsedBody = LookupReservationSchema.safeParse(body);

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

    const result = await lookupReservation(supabase, {
      phone_number: parsedBody.data.phone_number,
      password: parsedBody.data.password,
    });

    if (!result.ok) {
      const errorResult = result as ErrorResult<ReservationErrorCode, unknown>;
      logger.error('Failed to lookup reservation', errorResult.error.message);
    }

    return respond(c, result);
  });
};

