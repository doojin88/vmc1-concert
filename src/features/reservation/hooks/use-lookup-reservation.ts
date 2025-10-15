import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/remote/api-client';
import type { LookupReservationInput, ReservationListResponse } from '../lib/dto';

export function useLookupReservation() {
  return useMutation({
    mutationFn: async (input: LookupReservationInput) => {
      const response = await apiClient.post<ReservationListResponse>(
        '/api/reservations/lookup',
        input
      );
      return response.data;
    },
  });
}

