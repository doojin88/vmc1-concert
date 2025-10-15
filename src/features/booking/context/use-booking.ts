import { useContext } from 'react';
import { BookingContext } from './booking-provider';

export function useBooking() {
  const context = useContext(BookingContext);
  
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  
  return context;
}

