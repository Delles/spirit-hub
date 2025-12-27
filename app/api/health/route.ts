/**
 * Health check endpoint for monitoring and load balancer probes
 * GET /api/health
 */
export function GET() {
    return Response.json({
        status: "ok",
        timestamp: Date.now(),
        environment: process.env.NODE_ENV,
    });
}
