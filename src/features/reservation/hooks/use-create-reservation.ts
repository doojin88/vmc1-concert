import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/remote/api-client';
import { useBooking } from '@/features/booking/context/use-booking';
import type { CreateReservationInput, ReservationResponse } from '../lib/dto';

export function useCreateReservation(concertId: string) {
  const router = useRouter();
  const { actions } = useBooking();

  return useMutation({
    mutationFn: async (input: Omit<CreateReservationInput, 'concert_id' | 'seat_ids'>) => {
      const response = await apiClient.post<ReservationResponse>('/api/reservations', input);
      return response.data;
    },
    onSuccess: (data) => {
      actions.clearSelection();
      router.push(`/concerts/${concertId}/confirmation?number=${data.reservation_number}`);
    },
  });
}

