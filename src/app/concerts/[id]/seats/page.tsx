'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSeats } from '@/features/seat/hooks/use-seats';
import { useBooking } from '@/features/booking/context/use-booking';
import { SeatMap } from '@/features/seat/components/seat-map';
import { SeatLegend } from '@/features/seat/components/seat-legend';
import { SelectionPanel } from '@/features/seat/components/selection-panel';

interface SeatSelectionPageProps {
  params: Promise<{ id: string }>;
}

export default function SeatSelectionPage({ params }: SeatSelectionPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { data, isLoading, error } = useSeats(id);
  const { actions } = useBooking();

  // 콘서트 ID 설정
  useEffect(() => {
    actions.setConcert(id);
  }, [id, actions]);

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
        <Button
          variant="ghost"
          onClick={() => router.push(`/concerts/${id}`)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          뒤로가기
        </Button>
        <div className="text-center py-12 space-y-4">
          <p className="text-destructive">좌석 정보를 불러오는데 실패했습니다.</p>
          <Button onClick={() => router.push(`/concerts/${id}`)}>
            콘서트 상세로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => router.push(`/concerts/${id}`)}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        뒤로가기
      </Button>

      <h1 className="text-3xl font-bold mb-6">좌석 선택</h1>

      <div className="space-y-6">
        <SeatLegend />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SeatMap seats={data.seats} />
          </div>
          <div>
            <SelectionPanel concertId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}

