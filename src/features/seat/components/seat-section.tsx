'use client';

import { SeatCard } from './seat-card';
import type { Seat } from '../lib/dto';

interface SeatSectionProps {
  section: 'A' | 'B' | 'C' | 'D';
  seats: Seat[];
}

export function SeatSection({ section, seats }: SeatSectionProps) {
  // 행별로 좌석 그룹화
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<number, Seat[]>);

  return (
    <div className="space-y-2">
      <div className="text-center font-bold text-lg mb-2">{section}구역</div>
      <div className="space-y-1">
        {[1, 2, 3, 4].map((row) => (
          <div key={row} className="flex gap-1 items-center">
            <span className="text-xs text-muted-foreground w-6">{row}행</span>
            <div className="flex gap-0.5">
              {seatsByRow[row]?.map((seat) => (
                <SeatCard key={seat.id} seat={seat} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

