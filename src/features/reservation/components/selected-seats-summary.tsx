'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { useBooking } from '@/features/booking/context/use-booking';

export function SelectedSeatsSummary() {
  const { state } = useBooking();

  return (
    <Card>
      <CardHeader>
        <CardTitle>선택한 좌석</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground">
          {state.selectedSeats.length}석 선택
        </div>
        
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {state.selectedSeats.map((seat) => (
            <div
              key={seat.id}
              className="flex justify-between items-center text-sm border-b pb-2"
            >
              <span>
                {seat.section}구역 {seat.row}행 {seat.column}열
              </span>
              <span className="font-medium">{formatPrice(seat.price)}</span>
            </div>
          ))}
        </div>
        
        <div className="pt-3 border-t">
          <div className="flex justify-between items-center">
            <span className="font-semibold">총 금액</span>
            <span className="text-xl font-bold text-primary">
              {formatPrice(state.totalAmount)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

