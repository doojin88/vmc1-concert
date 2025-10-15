import { z } from 'zod';

export const CreateReservationSchema = z.object({
  concert_id: z.string().uuid(),
  seat_ids: z.array(z.string().uuid()).min(1, '최소 1개 이상의 좌석을 선택해야 합니다'),
  customer_name: z
    .string()
    .min(2, '이름은 최소 2자 이상이어야 합니다')
    .max(20, '이름은 최대 20자까지 입력 가능합니다'),
  phone_number: z
    .string()
    .regex(/^01\d{8,9}$/, '올바른 휴대폰 번호 형식이 아닙니다 (예: 01012345678)'),
  password: z
    .string()
    .regex(/^\d{4}$/, '비밀번호는 숫자 4자리여야 합니다'),
});

export const ReservationResponseSchema = z.object({
  reservation_number: z.string(),
  customer_name: z.string(),
  phone_number: z.string(),
  total_amount: z.number().int(),
  created_at: z.string().datetime(),
  concert: z.object({
    name: z.string(),
    date: z.string().datetime(),
    venue_name: z.string(),
  }),
  seats: z.array(
    z.object({
      section: z.enum(['A', 'B', 'C', 'D']),
      row: z.number().int(),
      column: z.number().int(),
      grade: z.enum(['SPECIAL', 'PREMIUM', 'ADVANCED', 'REGULAR']),
    })
  ),
});

export const ReservationParamsSchema = z.object({
  number: z.string().min(1, 'Reservation number is required'),
});

export const LookupReservationSchema = z.object({
  phone_number: z
    .string()
    .regex(/^01\d{8,9}$/, '올바른 휴대폰 번호 형식이 아닙니다'),
  password: z
    .string()
    .regex(/^\d{4}$/, '비밀번호는 숫자 4자리여야 합니다'),
});

export const ReservationListResponseSchema = z.object({
  reservations: z.array(ReservationResponseSchema),
});

export const CancelReservationSchema = z.object({
  reservation_number: z.string().min(1, '예약 번호는 필수입니다'),
  phone_number: z
    .string()
    .regex(/^01\d{8,9}$/, '올바른 휴대폰 번호 형식이 아닙니다'),
  password: z
    .string()
    .regex(/^\d{4}$/, '비밀번호는 숫자 4자리여야 합니다'),
});

export type CreateReservationInput = z.infer<typeof CreateReservationSchema>;
export type ReservationResponse = z.infer<typeof ReservationResponseSchema>;
export type ReservationParams = z.infer<typeof ReservationParamsSchema>;
export type LookupReservationInput = z.infer<typeof LookupReservationSchema>;
export type ReservationListResponse = z.infer<typeof ReservationListResponseSchema>;
export type CancelReservationInput = z.infer<typeof CancelReservationSchema>;

