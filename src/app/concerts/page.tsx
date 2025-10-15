'use client';

import { Loader2 } from 'lucide-react';
import { useConcerts } from '@/features/concert/hooks/use-concerts';
import { ConcertList } from '@/features/concert/components/concert-list';
import { Button } from '@/components/ui/button';

export default function ConcertsPage() {
  const { data, isLoading, error, refetch } = useConcerts();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 space-y-4">
          <p className="text-destructive">
            콘서트 목록을 불러오는데 실패했습니다.
          </p>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'}
          </p>
          <Button onClick={() => refetch()}>다시 시도</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">콘서트 예약</h1>
      <ConcertList concerts={data?.concerts || []} />
    </div>
  );
}

