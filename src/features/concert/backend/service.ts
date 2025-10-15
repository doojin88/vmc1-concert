import type { SupabaseClient } from '@supabase/supabase-js';
import { failure, success, type HandlerResult } from '@/backend/http/response';
import { concertErrorCodes, type ConcertErrorCode } from './error';
import type { ConcertListResponse, ConcertDetailResponse } from './schema';

export async function listConcerts(
  supabase: SupabaseClient
): Promise<HandlerResult<ConcertListResponse, ConcertErrorCode, unknown>> {
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

        const venueName = (concert.venues as any)?.name ?? 'Unknown Venue';

        if (seatsError || !seats) {
          // 좌석 데이터가 없으면 기본값 사용
          return {
            id: concert.id,
            name: concert.name,
            date: concert.date,
            poster_url: concert.poster_url,
            venue_name: venueName,
            reserved_count: 0,
            total_seats: 320, // 4구역 × 4행 × 20열
          };
        }

        return {
          id: concert.id,
          name: concert.name,
          date: concert.date,
          poster_url: concert.poster_url,
          venue_name: venueName,
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

export async function getConcertById(
  supabase: SupabaseClient,
  concertId: string
): Promise<HandlerResult<ConcertDetailResponse, ConcertErrorCode, unknown>> {
  try {
    // 콘서트 및 공연장 정보 조회
    const { data: concert, error: concertError } = await supabase
      .from('concerts')
      .select(`
        id,
        name,
        date,
        description,
        poster_url,
        venues!inner(
          id,
          name,
          address,
          section_count,
          rows_per_section,
          columns_per_section
        )
      `)
      .eq('id', concertId)
      .single();

    if (concertError || !concert) {
      return failure(404, concertErrorCodes.notFound, 'Concert not found');
    }

    const venue = (concert.venues as any) as {
      id: string;
      name: string;
      address: string;
      section_count: number;
      rows_per_section: number;
      columns_per_section: number;
    };

    // 좌석 등급 정보 조회
    const { data: seatGrades, error: gradesError } = await supabase
      .from('seat_grades')
      .select('*')
      .eq('venue_id', venue.id)
      .order('price', { ascending: false });

    if (gradesError) {
      return failure(500, concertErrorCodes.fetchError, gradesError.message);
    }

    // 각 등급별 예약 현황 조회
    const gradesWithReservation = await Promise.all(
      (seatGrades || []).map(async (grade) => {
        const { data: seats, error: seatsError } = await supabase
          .from('seats')
          .select('id, status')
          .eq('concert_id', concertId)
          .eq('grade', grade.name);

        const totalSeats = seats?.length || 0;
        const reservedCount = seats?.filter((s) => s.status === 'RESERVED').length || 0;

        return {
          name: grade.name as 'SPECIAL' | 'PREMIUM' | 'ADVANCED' | 'REGULAR',
          price: grade.price,
          row_start: grade.row_start,
          row_end: grade.row_end,
          total_seats: totalSeats,
          reserved_count: reservedCount,
        };
      })
    );

    return success({
      concert: {
        id: concert.id,
        name: concert.name,
        date: concert.date,
        description: concert.description,
        poster_url: concert.poster_url,
        venue: {
          name: venue.name,
          address: venue.address,
          section_count: venue.section_count,
          rows_per_section: venue.rows_per_section,
          columns_per_section: venue.columns_per_section,
        },
        seat_grades: gradesWithReservation,
      },
    });
  } catch (err) {
    return failure(
      500,
      concertErrorCodes.fetchError,
      err instanceof Error ? err.message : 'Unknown error'
    );
  }
}

