"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/remote/api-client";
import type { CancelReservationInput } from "../lib/dto";

export function useCancelReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CancelReservationInput) => {
      const response = await apiClient.delete("/reservations", {
        data: input,
      });

      return response.data;
    },
    onSuccess: () => {
      // 예약 조회 쿼리 무효화하여 최신 데이터 반영
      queryClient.invalidateQueries({
        queryKey: ["reservations", "lookup"],
      });
    },
  });
}
