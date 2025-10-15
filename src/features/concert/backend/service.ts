import type { SupabaseClient } from '@supabase/supabase-js';
import { failure, success, type HandlerResult } from '@/backend/http/response';
import { concertErrorCodes, type ConcertServiceError } from './error';
import type { ConcertListResponse } from './schema';

export async function listConcerts(
  supabase: SupabaseClient
): Promise<HandlerResult<ConcertListResponse, ConcertServiceError, unknown>> {
  try {
    const { data: concerts, error } = await supabase
      .from('concerts')
      .select(`
        id,
        name,
        date,
        poster_url,
        venues!inner(name)
      `)
      .order('date', { ascending: true });

    if (error) {
      return failure(500, concertErrorCodes.fetchError, error.message);
    }

    // 각 콘서트의 좌석 예약 현황 조회
    const concertsWithReservation = await Promise.all(
      (concerts || []).map(async (concert) => {
        const { data: seats, error: seatsError } = await supabase
          .from('seats')
          .select('id, status')
          .eq('concert_id', concert.id);

        if (seatsError || !seats) {
          // 좌석 데이터가 없으면 기본값 사용
          return {
            id: concert.id,
            name: concert.name,
            date: concert.date,
            poster_url: concert.poster_url,
            venue_name: (concert.venues as { name: string }).name,
            reserved_count: 0,
            total_seats: 320, // 4구역 × 4행 × 20열
          };
        }

        return {
          id: concert.id,
          name: concert.name,
          date: concert.date,
          poster_url: concert.poster_url,
          venue_name: (concert.venues as { name: string }).name,
          reserved_count: seats.filter((s) => s.status === 'RESERVED').length,
          total_seats: seats.length,
        };
      })
    );

    return success({ concerts: concertsWithReservation });
  } catch (err) {
    return failure(
      500,
      concertErrorCodes.fetchError,
      err instanceof Error ? err.message : 'Unknown error'
    );
  }
}

