export function asyncErrorHandler<T extends (...args: any[]) => Promise<any>>(fn: T) {
  return async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>> | {
    status: 'error';
    message: string;
  }> => {
    try {
      return await fn(...args);
    } catch (error: unknown) {
      // Let Next.js special errors bubble through
      if (
        typeof error === 'object' &&
        error !== null &&
        'digest' in error &&
        (error as { digest?: string }).digest === 'NEXT_REDIRECT' ||
        (error as { digest?: string }).digest === 'NEXT_NOT_FOUND'
      ) {
        throw error;
      }

      console.error("Error from asyncErrorHandler:", error);

      if (
        typeof error === 'object' &&
        error !== null
      ) {
        const err = error as {
          message?: string;
          code?: string;
          status?: number;
        };

        if (err.code === 'ERR_BAD_REQUEST') {
          return {
            status: 'error',
            message: err.message || 'Bad request',
          };
        }

        if (err.status === 500) {
          return {
            status: 'error',
            message: 'Server problem, please try again later',
          };
        }

        return {
          status: 'error',
          message: err.message || 'Something went wrong',
        };
      }

      // Fallback for non-object error
      return {
        status: 'error',
        message: 'An unknown error occurred',
      };
    }
  };
}
