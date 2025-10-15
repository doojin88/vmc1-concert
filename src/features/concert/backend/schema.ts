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

export const SeatGradeSchema = z.object({
  name: z.enum(['SPECIAL', 'PREMIUM', 'ADVANCED', 'REGULAR']),
  price: z.number().int().positive(),
  row_start: z.number().int().positive(),
  row_end: z.number().int().positive(),
  total_seats: z.number().int().min(0),
  reserved_count: z.number().int().min(0),
});

export const VenueSchema = z.object({
  name: z.string(),
  address: z.string(),
  section_count: z.number().int().positive(),
  rows_per_section: z.number().int().positive(),
  columns_per_section: z.number().int().positive(),
});

export const ConcertDetailSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  date: z.string().datetime(),
  description: z.string().nullable(),
  poster_url: z.string().url().nullable(),
  venue: VenueSchema,
  seat_grades: z.array(SeatGradeSchema),
});

export const ConcertDetailResponseSchema = z.object({
  concert: ConcertDetailSchema,
});

export const ConcertParamsSchema = z.object({
  id: z.string().uuid('Invalid concert ID format'),
});

export type Concert = z.infer<typeof ConcertSchema>;
export type ConcertListResponse = z.infer<typeof ConcertListResponseSchema>;
export type SeatGrade = z.infer<typeof SeatGradeSchema>;
export type Venue = z.infer<typeof VenueSchema>;
export type ConcertDetail = z.infer<typeof ConcertDetailSchema>;
export type ConcertDetailResponse = z.infer<typeof ConcertDetailResponseSchema>;
export type ConcertParams = z.infer<typeof ConcertParamsSchema>;

