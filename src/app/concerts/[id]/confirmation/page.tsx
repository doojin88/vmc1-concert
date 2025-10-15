'use client';

import { use, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useReservation } from '@/features/reservation/hooks/use-reservation';
import { useBooking } from '@/features/booking/context/use-booking';
import { ReservationConfirmation } from '@/features/reservation/components/reservation-confirmation';

interface ConfirmationPageProps {
  params: Promise<{ id: string }>;
}

export default function ConfirmationPage({ params }: ConfirmationPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const searchParams = useSearchParams();
  const reservationNumber = searchParams.get('number');
  const { actions } = useBooking();

  const { data, isLoading, error } = useReservation(reservationNumber);

  // Context 초기화 (예약 완료 후)
  useEffect(() => {
    actions.clearSelection();
  }, [actions]);

  // 예약 번호 없으면 홈으로 리다이렉트
  useEffect(() => {
    if (!reservationNumber) {
      router.replace('/concerts');
    }
  }, [reservationNumber, router]);

  if (!reservationNumber) {
    return null; // 리다이렉트 중
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 space-y-4">
          <p className="text-destructive">예약 정보를 불러오는데 실패했습니다.</p>
          <Button onClick={() => router.push('/concerts')}>홈으로</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <ReservationConfirmation reservation={data} />
    </div>
  );
}

