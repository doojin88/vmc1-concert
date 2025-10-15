import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/remote/api-client';
import type { ConcertDetailResponse } from '../lib/dto';

export function useConcertDetail(concertId: string) {
  return useQuery({
    queryKey: ['concert', concertId],
    queryFn: async () => {
      const response = await apiClient.get<ConcertDetailResponse>(
        `/api/concerts/${concertId}`
      );
      return response.data;
    },
    enabled: !!concertId,
    staleTime: 1000 * 60 * 5, // 5분
    retry: 3,
  });
}

