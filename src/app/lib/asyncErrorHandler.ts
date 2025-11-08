export function asyncErrorHandler<T extends (...args: any[]) => Promise<any>>(
  fn: T
) {
  return async (
    ...args: Parameters<T>
  ): Promise<
    | Awaited<ReturnType<T>>
    | {
        status: 'error';
        message: string;
        errors?: any;
      }
  > => {
    try {
      return await fn(...args);
    } catch (error: any) {
      // Let Next.js internal errors pass through
      if (
        error?.digest === 'NEXT_REDIRECT' ||
        error?.digest === 'NEXT_NOT_FOUND'
      ) {
        throw error;
      }

      // Log Laravel response if available
      if (error?.response?.data) {
        return {
          status: 'error',
          message: error.response.data.message || 'An error occurred',
          errors: error.response.data.errors || null,
        };
      }

      // Fallback for other known error shapes
      return {
        status: 'error',
        message: error?.message || 'An unknown error occurred',
      };
    }
  };
}
