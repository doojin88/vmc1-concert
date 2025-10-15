'use client';

import { createContext, useReducer, useMemo, type ReactNode } from 'react';
import { bookingReducer, initialBookingState } from './booking-reducer';
import type { BookingContextValue, Seat } from '../types';

export const BookingContext = createContext<BookingContextValue | undefined>(
  undefined
);

interface BookingProviderProps {
  children: ReactNode;
}

export function BookingProvider({ children }: BookingProviderProps) {
  const [state, dispatch] = useReducer(bookingReducer, initialBookingState);

  const actions = useMemo(
    () => ({
      setConcert: (concertId: string) => {
        dispatch({ type: 'SET_CONCERT', payload: { concertId } });
      },
      selectSeat: (seat: Seat) => {
        dispatch({ type: 'SELECT_SEAT', payload: { seat } });
      },
      deselectSeat: (seatId: string) => {
        dispatch({ type: 'DESELECT_SEAT', payload: { seatId } });
      },
      clearSelection: () => {
        dispatch({ type: 'CLEAR_SELECTION' });
      },
    }),
    []
  );

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

