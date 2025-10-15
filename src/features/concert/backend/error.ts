export const concertErrorCodes = {
  fetchError: 'CONCERT_FETCH_ERROR',
  notFound: 'CONCERT_NOT_FOUND',
  invalidParams: 'CONCERT_INVALID_PARAMS',
} as const;

export type ConcertServiceError =
  | { code: typeof concertErrorCodes.fetchError; message: string }
  | { code: typeof concertErrorCodes.notFound; message: string }
  | { code: typeof concertErrorCodes.invalidParams; message: string };

