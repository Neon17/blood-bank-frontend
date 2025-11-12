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
        let errorMessage = error.response.data.message || 'An error occurred';

        // If the message is an array, join it into a single string
        if (Array.isArray(errorMessage)) {
          errorMessage = errorMessage.join(', ');
        }

        // Enhance messages for common HTTP status codes
        if (error.response.status) {
          switch (error.response.status) {
            case 401:
              errorMessage = errorMessage || 'Unauthorized: Please log in.';
              break;
            case 403:
              errorMessage =
                errorMessage ||
                'Forbidden: You do not have permission to perform this action.';
              break;
            case 404:
              errorMessage = errorMessage || 'Resource not found.';
              break;
            case 422:
              // Validation errors, message already handled by array join
              errorMessage =
                errorMessage || 'Validation failed. Please check your input.';
              break;
            case 500:
              errorMessage =
                errorMessage || 'Server error: Please try again later.';
              break;
            default:
              break;
          }
        }

        return {
          status: 'error',
          message: errorMessage,
          errors: error.response.data.errors || null,
        };
      }

      // Fallback for other known error shapes
      return {
        status: 'error',
        message:
          error?.message || 'An unexpected error occurred. Please try again.',
      };
    }
  };
}
