'use client';

import { SeatCard } from './seat-card';
import type { Seat } from '../lib/dto';

interface SeatSectionProps {
  section: 'A' | 'B' | 'C' | 'D';
  seats: Seat[];
}

export function SeatSection({ section, seats }: SeatSectionProps) {
  // 열별로 좌석 그룹화 (column 1~20)
  const seatsByColumn = seats.reduce((acc, seat) => {
    if (!acc[seat.column]) {
      acc[seat.column] = [];
    }
    acc[seat.column].push(seat);
    return acc;
  }, {} as Record<number, Seat[]>);

  return (
    <div className="space-y-2">
      <div className="text-center font-bold text-lg mb-3">{section}구역</div>
      <div className="space-y-1">
        {/* 1열부터 20열까지 무대에서 아래로 표시 */}
        {Array.from({ length: 20 }, (_, i) => i + 1).map((column) => (
          <div key={column} className="flex gap-1 items-center">
            <span className="text-xs text-muted-foreground w-6 text-right">{column}</span>
            <div className="flex gap-0.5">
              {/* 각 열의 행(1~4)을 좌에서 우로 표시 */}
              {seatsByColumn[column]
                ?.sort((a, b) => a.row - b.row)
                .map((seat) => (
                  <SeatCard key={seat.id} seat={seat} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

