import { Hono } from 'hono';
import { errorBoundary } from '@/backend/middleware/error';
import { withAppContext } from '@/backend/middleware/context';
import { withSupabase } from '@/backend/middleware/supabase';
import { registerExampleRoutes } from '@/features/example/backend/route';
import { registerConcertRoutes } from '@/features/concert/backend/route';
import { registerSeatRoutes } from '@/features/seat/backend/route';
import { registerReservationRoutes } from '@/features/reservation/backend/route';
import type { AppEnv } from '@/backend/hono/context';

let singletonApp: Hono<AppEnv> | null = null;

export const createHonoApp = () => {
  // 개발 환경에서는 싱글톤 캐시 무효화 (hot reload 지원)
  if (process.env.NODE_ENV === 'development') {
    singletonApp = null;
  }

  if (singletonApp) {
    return singletonApp;
  }

  const app = new Hono<AppEnv>().basePath('/api');

  app.use('*', errorBoundary());
  app.use('*', withAppContext());
  app.use('*', withSupabase());

  registerExampleRoutes(app);
  registerConcertRoutes(app);
  registerSeatRoutes(app);
  registerReservationRoutes(app);


  singletonApp = app;

  return app;
};
