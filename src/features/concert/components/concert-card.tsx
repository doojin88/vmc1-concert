'use client';

import { Calendar, MapPin, Users } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatConcertDate, cn } from '@/lib/utils';
import type { Concert } from '../lib/dto';

interface ConcertCardProps {
  concert: Concert;
  onClick: () => void;
}

export function ConcertCard({ concert, onClick }: ConcertCardProps) {
  const isSoldOut = concert.reserved_count >= concert.total_seats;
  const formattedDate = formatConcertDate(concert.date);

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-lg',
        isSoldOut && 'opacity-60 cursor-not-allowed'
      )}
      onClick={isSoldOut ? undefined : onClick}
    >
      <CardContent className="p-0">
        <div className="relative aspect-[3/4]">
          <Image
            src={concert.poster_url || `https://picsum.photos/seed/${concert.id}/400/600`}
            alt={concert.name}
            fill
            className="object-cover rounded-t-lg"
            onError={(e) => {
              const target = e.currentTarget;
              target.src = `https://picsum.photos/seed/${concert.id}/400/600`;
            }}
          />
          {isSoldOut && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
              <Badge variant="destructive" className="text-lg">
                매진
              </Badge>
            </div>
          )}
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-bold text-lg line-clamp-1">{concert.name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{concert.venue_name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>
              {concert.reserved_count}/{concert.total_seats}명
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

