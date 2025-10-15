'use client';

import { cn } from '@/lib/utils';
import { useBooking } from '@/features/booking/context/use-booking';
import type { Seat } from '../lib/dto';

interface SeatCardProps {
  seat: Seat;
}

const gradeColors = {
  SPECIAL: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-500',
  PREMIUM: 'bg-blue-100 hover:bg-blue-200 border-blue-500',
  ADVANCED: 'bg-green-100 hover:bg-green-200 border-green-500',
  REGULAR: 'bg-orange-100 hover:bg-orange-200 border-orange-500',
};

export function SeatCard({ seat }: SeatCardProps) {
  const { state, actions } = useBooking();
  
  const isSelected = state.selectedSeats.some((s) => s.id === seat.id);
  const isReserved = seat.status === 'RESERVED';
  
  const handleClick = () => {
    if (isReserved) return;
    
    if (isSelected) {
      actions.deselectSeat(seat.id);
    } else {
      actions.selectSeat(seat);
    }
  };
  
  return (
    <button
      onClick={handleClick}
      disabled={isReserved}
      className={cn(
        'w-8 h-8 text-xs font-medium border-2 rounded transition-colors',
        isReserved && 'bg-slate-400 cursor-not-allowed border-slate-600 text-white',
        !isReserved && gradeColors[seat.grade],
        isSelected && 'ring-2 ring-primary ring-offset-1'
      )}
      title={`${seat.section}구역 ${seat.column}열 ${seat.row}행`}
    >
      {seat.row}
    </button>
  );
}

