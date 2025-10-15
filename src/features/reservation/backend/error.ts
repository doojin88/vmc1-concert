export const reservationErrorCodes = {
  fetchError: 'RESERVATION_FETCH_ERROR',
  createError: 'RESERVATION_CREATE_ERROR',
  seatUnavailable: 'SEAT_UNAVAILABLE',
  invalidParams: 'RESERVATION_INVALID_PARAMS',
  notFound: 'RESERVATION_NOT_FOUND',
  cancelError: 'RESERVATION_CANCEL_ERROR',
  invalidCredentials: 'RESERVATION_INVALID_CREDENTIALS',
  invalidStatus: 'RESERVATION_INVALID_STATUS',
  cancelNotAllowed: 'RESERVATION_CANCEL_NOT_ALLOWED',
} as const;

export type ReservationErrorCode = typeof reservationErrorCodes[keyof typeof reservationErrorCodes];

export type ReservationServiceError =
  | { code: typeof reservationErrorCodes.fetchError; message: string }
  | { code: typeof reservationErrorCodes.createError; message: string }
  | { code: typeof reservationErrorCodes.seatUnavailable; message: string }
  | { code: typeof reservationErrorCodes.invalidParams; message: string }
  | { code: typeof reservationErrorCodes.notFound; message: string }
  | { code: typeof reservationErrorCodes.cancelError; message: string }
  | { code: typeof reservationErrorCodes.invalidCredentials; message: string }
  | { code: typeof reservationErrorCodes.invalidStatus; message: string }
  | { code: typeof reservationErrorCodes.cancelNotAllowed; message: string };

