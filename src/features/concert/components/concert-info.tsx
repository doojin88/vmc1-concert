'use client';

import { Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatConcertDate } from '@/lib/utils';
import type { ConcertDetail } from '../lib/dto';

interface ConcertInfoProps {
  concert: ConcertDetail;
}

export function ConcertInfo({ concert }: ConcertInfoProps) {
  const formattedDate = formatConcertDate(concert.date);

  return (
    <Card>
      <CardHeader>
        <CardTitle>콘서트 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-[3/4] max-w-sm mx-auto">
          <Image
            src={concert.poster_url || `https://picsum.photos/seed/${concert.id}/400/600`}
            alt={concert.name}
            fill
            className="object-cover rounded-lg"
            onError={(e) => {
              const target = e.currentTarget;
              target.src = `https://picsum.photos/seed/${concert.id}/400/600`;
            }}
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">{concert.name}</h2>
          {concert.description && (
            <p className="text-muted-foreground whitespace-pre-line">
              {concert.description}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <span>{concert.venue.name}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

