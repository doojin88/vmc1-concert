'use client';

import { useRouter } from 'next/navigation';
import { use } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useConcertDetail } from '@/features/concert/hooks/use-concert-detail';
import { ConcertInfo } from '@/features/concert/components/concert-info';
import { VenueInfo } from '@/features/concert/components/venue-info';
import { SeatGradeList } from '@/features/concert/components/seat-grade-list';

interface ConcertDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ConcertDetailPage({ params }: ConcertDetailPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { data, isLoading, error } = useConcertDetail(id);

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
          onClick={() => router.push('/concerts')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          목록으로
        </Button>
        <div className="text-center py-12 space-y-4">
          <p className="text-destructive">콘서트 정보를 불러오는데 실패했습니다.</p>
          <Button onClick={() => router.push('/concerts')}>목록으로 돌아가기</Button>
        </div>
      </div>
    );
  }

  const concert = data.concert;
  const isSoldOut = concert.seat_grades.every(
    (g) => g.reserved_count >= g.total_seats
  );
  const isPastConcert = new Date(concert.date) < new Date();

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => router.push('/concerts')}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        목록으로
      </Button>

      <div className="space-y-6">
        <ConcertInfo concert={concert} />
        <VenueInfo venue={concert.venue} />
        <SeatGradeList grades={concert.seat_grades} />

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={() => router.push(`/concerts/${id}/seats`)}
            disabled={isSoldOut || isPastConcert}
          >
            {isSoldOut
              ? '매진되었습니다'
              : isPastConcert
              ? '예약 기간이 종료되었습니다'
              : '좌석 선택하기'}
          </Button>
        </div>
      </div>
    </div>
  );
}

