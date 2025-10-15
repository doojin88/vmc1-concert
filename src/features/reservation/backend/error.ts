export const reservationErrorCodes = {
  fetchError: 'RESERVATION_FETCH_ERROR',
  createError: 'RESERVATION_CREATE_ERROR',
  seatUnavailable: 'SEAT_UNAVAILABLE',
  invalidParams: 'RESERVATION_INVALID_PARAMS',
  notFound: 'RESERVATION_NOT_FOUND',
} as const;

export type ReservationServiceError =
  | { code: typeof reservationErrorCodes.fetchError; message: string }
  | { code: typeof reservationErrorCodes.createError; message: string }
  | { code: typeof reservationErrorCodes.seatUnavailable; message: string }
  | { code: typeof reservationErrorCodes.invalidParams; message: string }
  | { code: typeof reservationErrorCodes.notFound; message: string };

