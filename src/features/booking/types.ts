import type { Seat } from '@/features/seat/lib/dto';

export type { Seat };

export interface BookingState {
  selectedConcertId: string | null;
  selectedSeats: Seat[];
  totalAmount: number;
}

export type BookingAction =
  | { type: 'SET_CONCERT'; payload: { concertId: string } }
  | { type: 'SELECT_SEAT'; payload: { seat: Seat } }
  | { type: 'DESELECT_SEAT'; payload: { seatId: string } }
  | { type: 'CLEAR_SELECTION' };

export interface BookingContextValue {
  state: BookingState;
  actions: {
    setConcert: (concertId: string) => void;
    selectSeat: (seat: Seat) => void;
    deselectSeat: (seatId: string) => void;
    clearSelection: () => void;
  };
}

