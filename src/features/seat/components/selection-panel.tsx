'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { useBooking } from '@/features/booking/context/use-booking';

interface SelectionPanelProps {
  concertId: string;
}

export function SelectionPanel({ concertId }: SelectionPanelProps) {
  const router = useRouter();
  const { state } = useBooking();
  
  const hasSelection = state.selectedSeats.length > 0;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>선택한 좌석</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          {state.selectedSeats.length}석 선택
        </div>
        
        {state.selectedSeats.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {state.selectedSeats.map((seat) => (
              <div
                key={seat.id}
                className="flex justify-between items-center text-sm"
              >
                <span>
                  {seat.section}구역 {seat.row}행 {seat.column}열
                </span>
                <span className="font-medium">{formatPrice(seat.price)}</span>
              </div>
            ))}
          </div>
        )}
        
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">총 금액</span>
            <span className="text-xl font-bold">
              {formatPrice(state.totalAmount)}
            </span>
          </div>
          
          <Button
            className="w-full"
            size="lg"
            disabled={!hasSelection}
            onClick={() => router.push(`/concerts/${concertId}/booking`)}
          >
            {hasSelection ? '예약하기' : '좌석을 선택해주세요'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

