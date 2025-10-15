export const seatErrorCodes = {
  fetchError: 'SEAT_FETCH_ERROR',
  notFound: 'SEAT_NOT_FOUND',
  invalidParams: 'SEAT_INVALID_PARAMS',
} as const;

export type SeatErrorCode = typeof seatErrorCodes[keyof typeof seatErrorCodes];

export type SeatServiceError =
  | { code: typeof seatErrorCodes.fetchError; message: string }
  | { code: typeof seatErrorCodes.notFound; message: string }
  | { code: typeof seatErrorCodes.invalidParams; message: string };

