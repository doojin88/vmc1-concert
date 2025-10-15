'use client';

import { useRouter } from 'next/navigation';
import { ConcertCard } from './concert-card';
import type { Concert } from '../lib/dto';

interface ConcertListProps {
  concerts: Concert[];
}

export function ConcertList({ concerts }: ConcertListProps) {
  const router = useRouter();

  if (concerts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          현재 예약 가능한 콘서트가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {concerts.map((concert) => (
        <ConcertCard
          key={concert.id}
          concert={concert}
          onClick={() => router.push(`/concerts/${concert.id}`)}
        />
      ))}
    </div>
  );
}

