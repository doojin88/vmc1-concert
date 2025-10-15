'use client';

import { SeatSection } from './seat-section';
import type { Seat } from '../lib/dto';

interface SeatMapProps {
  seats: Seat[];
}

export function SeatMap({ seats }: SeatMapProps) {
  // 구역별로 좌석 그룹화
  const seatsBySection = seats.reduce((acc, seat) => {
    if (!acc[seat.section]) {
      acc[seat.section] = [];
    }
    acc[seat.section].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  const sections: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="text-center mb-6 py-2 bg-muted rounded">
        <span className="text-sm font-medium">무대</span>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {sections.map((section) => (
          <SeatSection
            key={section}
            section={section}
            seats={seatsBySection[section] || []}
          />
        ))}
      </div>
    </div>
  );
}

