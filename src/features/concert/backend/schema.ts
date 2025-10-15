import { z } from 'zod';

export const ConcertSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  date: z.string().datetime(),
  poster_url: z.string().url().nullable(),
  venue_name: z.string(),
  reserved_count: z.number().int().min(0),
  total_seats: z.number().int().min(0),
});

export const ConcertListResponseSchema = z.object({
  concerts: z.array(ConcertSchema),
});

export type Concert = z.infer<typeof ConcertSchema>;
export type ConcertListResponse = z.infer<typeof ConcertListResponseSchema>;

