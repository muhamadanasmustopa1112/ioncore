export function getHttpStatus(error: unknown): number | undefined {
  return (error as { response?: { status?: number } })?.response?.status;
}

/** 4xx / network — show inline empty state, not a global toast. */
export function isNonCriticalQueryError(error: unknown): boolean {
  const status = getHttpStatus(error);
  return status === undefined || status < 500;
}

export function shouldShowGlobalQueryErrorToast(error: unknown): boolean {
  const status = getHttpStatus(error);
  return status !== undefined && status >= 500;
}
