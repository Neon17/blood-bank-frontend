
export function asyncErrorHandler(fn: (...args: any[]) => Promise<any>) {
    return async (...args: any[]) => {
        try {
            return await fn(...args);
        } catch (error: any) {
            // Allow special Next.js redirects/errors to bubble
            if (error.digest === 'NEXT_REDIRECT' || error.digest === 'NEXT_NOT_FOUND') {
                throw error;
            }

            console.error("Error from asyncErrorHandler:", error);

            if (error.code === 'ERR_BAD_REQUEST') {
                return {
                    status: 'error',
                    message: error?.message || 'Bad request',
                };
            } else if (error.status === 500) {
                return {
                    status: 'error',
                    message: 'Server problem, please try again later',
                };
            } else {
                return {
                    status: 'error',
                    message: error?.message || 'Something went wrong',
                };
            }
        }
    };
}
