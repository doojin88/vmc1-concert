'use client';

import { formatPrice } from '@/lib/utils';

const legends = [
  { grade: 'SPECIAL', label: 'Special', color: 'bg-yellow-100 border-yellow-500', price: 250000 },
  { grade: 'PREMIUM', label: 'Premium', color: 'bg-blue-100 border-blue-500', price: 190000 },
  { grade: 'ADVANCED', label: 'Advanced', color: 'bg-green-100 border-green-500', price: 170000 },
  { grade: 'REGULAR', label: 'Regular', color: 'bg-orange-100 border-orange-500', price: 140000 },
  { grade: 'RESERVED', label: '예약됨', color: 'bg-slate-400 border-slate-600', price: null },
];

export function SeatLegend() {
  return (
    <div className="bg-card border rounded-lg p-4">
      <h3 className="font-semibold mb-3">좌석 등급</h3>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {legends.map((legend) => (
          <div key={legend.grade} className="flex items-center gap-2">
            <div className={`w-6 h-6 border-2 rounded ${legend.color}`} />
            <div className="text-sm">
              <div className="font-medium">{legend.label}</div>
              {legend.price && (
                <div className="text-xs text-muted-foreground">
                  {formatPrice(legend.price)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

