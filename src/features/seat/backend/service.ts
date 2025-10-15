import type { SupabaseClient } from '@supabase/supabase-js';
import { failure, success, type HandlerResult } from '@/backend/http/response';
import { seatErrorCodes, type SeatErrorCode } from './error';
import type { SeatListResponse } from './schema';

export async function listSeats(
  supabase: SupabaseClient,
  concertId: string
): Promise<HandlerResult<SeatListResponse, SeatErrorCode, unknown>> {
  try {
    // 좌석 조회
    const { data: seats, error: seatsError } = await supabase
      .from('seats')
      .select('id, section, row, column, grade, status')
      .eq('concert_id', concertId)
      .order('section', { ascending: true })
      .order('row', { ascending: true })
      .order('column', { ascending: true });

    if (seatsError) {
      return failure(500, seatErrorCodes.fetchError, seatsError.message);
    }

    // 콘서트 및 가격 정보 조회
    const { data: concert, error: concertError } = await supabase
      .from('concerts')
      .select('venue_id')
      .eq('id', concertId)
      .single();

    if (concertError || !concert) {
      return failure(404, seatErrorCodes.notFound, 'Concert not found');
    }

    const { data: grades, error: gradesError } = await supabase
      .from('seat_grades')
      .select('name, price')
      .eq('venue_id', concert.venue_id);

    if (gradesError) {
      return failure(500, seatErrorCodes.fetchError, gradesError.message);
    }

    // 좌석에 가격 정보 추가
    const priceMap = new Map((grades || []).map((g) => [g.name, g.price]));
    const seatsWithPrice = (seats || []).map((seat) => ({
      ...seat,
      price: priceMap.get(seat.grade) || 0,
    }));

    return success({ seats: seatsWithPrice });
  } catch (err) {
    return failure(
      500,
      seatErrorCodes.fetchError,
      err instanceof Error ? err.message : 'Unknown error'
    );
  }
}

