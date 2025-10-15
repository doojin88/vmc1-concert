import type { BookingState, BookingAction } from '../types';

export const initialBookingState: BookingState = {
  selectedConcertId: null,
  selectedSeats: [],
  totalAmount: 0,
};

export function bookingReducer(
  state: BookingState,
  action: BookingAction
): BookingState {
  switch (action.type) {
    case 'SET_CONCERT':
      return {
        ...state,
        selectedConcertId: action.payload.concertId,
      };

    case 'SELECT_SEAT': {
      const { seat } = action.payload;
      
      // 중복 선택 방지
      if (state.selectedSeats.some((s) => s.id === seat.id)) {
        return state;
      }

      const newSeats = [...state.selectedSeats, seat];
      const newTotal = newSeats.reduce((sum, s) => sum + s.price, 0);

      return {
        ...state,
        selectedSeats: newSeats,
        totalAmount: newTotal,
      };
    }

    case 'DESELECT_SEAT': {
      const { seatId } = action.payload;
      const newSeats = state.selectedSeats.filter((s) => s.id !== seatId);
      const newTotal = newSeats.reduce((sum, s) => sum + s.price, 0);

      return {
        ...state,
        selectedSeats: newSeats,
        totalAmount: newTotal,
      };
    }

    case 'CLEAR_SELECTION':
      return initialBookingState;

    default:
      return state;
  }
}

