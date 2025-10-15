'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/features/booking/context/use-booking';
import { BookingForm } from '@/features/reservation/components/booking-form';
import { SelectedSeatsSummary } from '@/features/reservation/components/selected-seats-summary';

interface BookingFormPageProps {
  params: Promise<{ id: string }>;
}

export default function BookingFormPage({ params }: BookingFormPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { state } = useBooking();

  // 좌석 선택 여부 확인
  useEffect(() => {
    if (state.selectedSeats.length === 0) {
      router.push(`/concerts/${id}/seats`);
    }
  }, [state.selectedSeats.length, id, router]);

  if (state.selectedSeats.length === 0) {
    return null; // 리다이렉트 중
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">예약 정보 입력</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-card border rounded-lg p-6">
            <BookingForm concertId={id} />
          </div>
        </div>
        <div>
          <SelectedSeatsSummary />
        </div>
      </div>
    </div>
  );
}

