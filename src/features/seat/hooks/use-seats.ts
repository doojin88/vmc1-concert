import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/remote/api-client';
import type { SeatListResponse } from '../lib/dto';

export function useSeats(concertId: string) {
  return useQuery({
    queryKey: ['seats', concertId],
    queryFn: async () => {
      const response = await apiClient.get<SeatListResponse>(
        `/api/concerts/${concertId}/seats`
      );
      return response.data;
    },
    enabled: !!concertId,
    staleTime: 1000 * 60 * 2, // 2분 (좌석은 자주 변경될 수 있음)
    refetchInterval: 1000 * 30, // 30초마다 자동 리패치
  });
}

