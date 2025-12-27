/**
 * Error Reporting Abstraction Layer
 * 
 * Centralizes error reporting to make it easy to swap in
 * Sentry, PostHog, or other error tracking services later.
 * 
 * Current implementation: Logs to console (captured by Vercel Runtime Logs)
 * Future: Replace captureException body with Sentry.captureException(error)
 */

export interface ErrorContext {
    /** Component or function where error occurred */
    source?: string;
    /** Additional metadata for debugging */
    tags?: Record<string, string>;
    /** User-facing context (no PII) */
    extra?: Record<string, unknown>;
}

/**
 * Report an error to the error tracking service.
 * In production, errors are logged and captured by Vercel Runtime Logs.
 * 
 * @example
 * captureException(error, { source: 'LifePathCalculation' });
 */
export function captureException(
    error: Error | unknown,
    context?: ErrorContext
): void {
    // Normalize to Error object
    const normalizedError = error instanceof Error
        ? error
        : new Error(String(error));

    // In development, log with full context
    if (process.env.NODE_ENV === 'development') {
        console.group('🚨 Error Captured');
        console.error(normalizedError);
        if (context) {
            console.table(context);
        }
        console.groupEnd();
        return;
    }

    // Production: Simple log (captured by Vercel Runtime Logs)
    // TODO: Replace with Sentry.captureException when needed
    // Sentry.captureException(normalizedError, { 
    //   tags: context?.tags,
    //   extra: { source: context?.source, ...context?.extra }
    // });
    console.error(
        `[${context?.source ?? 'Unknown'}]`,
        normalizedError.message,
        context?.extra ? JSON.stringify(context.extra) : ''
    );
}

/**
 * Report a warning or non-critical issue.
 */
export function captureMessage(
    message: string,
    context?: ErrorContext
): void {
    if (process.env.NODE_ENV === 'development') {
        console.warn(`⚠️ [${context?.source ?? 'App'}]`, message, context?.extra);
        return;
    }

    // Production: Log warning
    // TODO: Replace with Sentry.captureMessage when needed
    console.warn(`[${context?.source ?? 'App'}]`, message);
}
