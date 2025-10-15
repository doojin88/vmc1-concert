import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/remote/api-client';
import type { ConcertListResponse } from '../lib/dto';

export function useConcerts() {
  return useQuery({
    queryKey: ['concerts'],
    queryFn: async () => {
      const response = await apiClient.get<ConcertListResponse>('/api/concerts');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5분
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

