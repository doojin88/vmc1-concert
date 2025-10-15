import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/remote/api-client';
import type { ReservationResponse } from '../lib/dto';

export function useReservation(reservationNumber: string | null) {
  return useQuery({
    queryKey: ['reservation', reservationNumber],
    queryFn: async () => {
      if (!reservationNumber) {
        throw new Error('Reservation number is required');
      }
      const response = await apiClient.get<ReservationResponse>(
        `/api/reservations/${reservationNumber}`
      );
      return response.data;
    },
    enabled: !!reservationNumber,
    staleTime: Infinity, // 예약 정보는 변경되지 않으므로 무한 캐싱
  });
}

