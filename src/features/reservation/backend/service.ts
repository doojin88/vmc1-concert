import type { SupabaseClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { failure, success, type HandlerResult } from '@/backend/http/response';
import { reservationErrorCodes, type ReservationServiceError } from './error';
import type { CreateReservationInput, ReservationResponse } from './schema';

export async function createReservation(
  supabase: SupabaseClient,
  input: CreateReservationInput
): Promise<HandlerResult<ReservationResponse, ReservationServiceError, unknown>> {
  try {
    const passwordHash = await bcrypt.hash(input.password, 10);

    const { data: result, error: rpcError } = await supabase.rpc(
      'create_reservation_transaction',
      {
        p_concert_id: input.concert_id,
        p_seat_ids: input.seat_ids,
        p_customer_name: input.customer_name,
        p_phone_number: input.phone_number,
        p_password_hash: passwordHash,
      }
    );

    if (rpcError || !result) {
      // 좌석이 이미 예약된 경우
      if (rpcError?.message?.includes('SEAT_UNAVAILABLE')) {
        return failure(
          409,
          reservationErrorCodes.seatUnavailable,
          '선택한 좌석이 이미 예약되었습니다'
        );
      }
      return failure(
        500,
        reservationErrorCodes.createError,
        rpcError?.message || 'Failed to create reservation'
      );
    }

    return success(result as ReservationResponse);
  } catch (err) {
    return failure(
      500,
      reservationErrorCodes.createError,
      err instanceof Error ? err.message : 'Unknown error'
    );
  }
}

