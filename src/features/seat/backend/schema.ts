import { z } from 'zod';

export const SeatSchema = z.object({
  id: z.string().uuid(),
  section: z.enum(['A', 'B', 'C', 'D']),
  row: z.number().int().min(1).max(4),
  column: z.number().int().min(1).max(20),
  grade: z.enum(['SPECIAL', 'PREMIUM', 'ADVANCED', 'REGULAR']),
  status: z.enum(['AVAILABLE', 'RESERVED']),
  price: z.number().int().positive(),
});

export const SeatListResponseSchema = z.object({
  seats: z.array(SeatSchema),
});

export const SeatParamsSchema = z.object({
  concertId: z.string().uuid('Invalid concert ID format'),
});

export type Seat = z.infer<typeof SeatSchema>;
export type SeatListResponse = z.infer<typeof SeatListResponseSchema>;
export type SeatParams = z.infer<typeof SeatParamsSchema>;

