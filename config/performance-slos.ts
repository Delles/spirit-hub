/**
 * Performance Service Level Objectives (SLOs) for SpiritHub.ro
 * 
 * These targets are based on Core Web Vitals and Vercel Edge performance benchmarks.
 * Use these thresholds for monitoring, alerting, and CI/CD quality gates.
 * 
 * Reference: https://web.dev/articles/vitals
 */

export const performanceSLOs = {
    /**
     * Largest Contentful Paint (LCP)
     * Measures loading performance
     * Target: < 2.5s (Good), 2.5-4.0s (Needs Improvement), > 4.0s (Poor)
     */
    LCP: {
        target: 2500, // ms
        warning: 4000,
        unit: 'ms',
        description: 'Largest Contentful Paint - Time until main content is visible',
    },

    /**
     * First Input Delay (FID) / Interaction to Next Paint (INP)
     * Measures interactivity
     * Target: < 100ms (Good), 100-300ms (Needs Improvement), > 300ms (Poor)
     * Note: INP is replacing FID in Core Web Vitals (March 2024)
     */
    FID: {
        target: 100, // ms
        warning: 300,
        unit: 'ms',
        description: 'First Input Delay - Time until page responds to first interaction',
    },

    INP: {
        target: 200, // ms
        warning: 500,
        unit: 'ms',
        description: 'Interaction to Next Paint - Responsiveness to all interactions',
    },

    /**
     * Cumulative Layout Shift (CLS)
     * Measures visual stability
     * Target: < 0.1 (Good), 0.1-0.25 (Needs Improvement), > 0.25 (Poor)
     */
    CLS: {
        target: 0.1,
        warning: 0.25,
        unit: 'score',
        description: 'Cumulative Layout Shift - Visual stability during page load',
    },

    /**
     * Time to First Byte (TTFB)
     * Measures server responsiveness
     * Target: < 200ms for Vercel Edge, < 600ms for origin
     */
    TTFB: {
        target: 200, // ms (Vercel Edge)
        warning: 600,
        unit: 'ms',
        description: 'Time to First Byte - Server response time',
    },

    /**
     * First Contentful Paint (FCP)
     * Measures when first content appears
     * Target: < 1.8s (Good), 1.8-3.0s (Needs Improvement), > 3.0s (Poor)
     */
    FCP: {
        target: 1800, // ms
        warning: 3000,
        unit: 'ms',
        description: 'First Contentful Paint - Time until first content is visible',
    },

    /**
     * Total Blocking Time (TBT)
     * Lab metric that correlates with FID
     * Target: < 200ms (Good), 200-600ms (Needs Improvement), > 600ms (Poor)
     */
    TBT: {
        target: 200, // ms
        warning: 600,
        unit: 'ms',
        description: 'Total Blocking Time - Sum of long task blocking periods',
    },

    /**
     * Bundle Size Budgets
     * Maximum JavaScript bundle sizes for optimal performance
     */
    bundleBudgets: {
        // First-load JS shared by all pages
        firstLoadJS: {
            target: 100, // KB
            warning: 150,
            unit: 'KB',
            description: 'First Load JS - Shared bundle size',
        },
        // Per-page JS budget
        pageJS: {
            target: 50, // KB
            warning: 100,
            unit: 'KB',
            description: 'Per-page JS budget',
        },
    },
} as const;

/**
 * Performance monitoring configuration for Vercel Analytics
 */
export const performanceMonitoring = {
    // Enable Core Web Vitals reporting
    webVitals: true,

    // Sample rate for performance data (1.0 = 100%)
    sampleRate: 1.0,

    // Paths to monitor with higher priority
    criticalPaths: [
        '/',
        '/numerologie/calea-vietii',
        '/numerologie/compatibilitate',
        '/bioritm',
        '/mesaj-zilnic',
    ],

    // Alert thresholds (percentage of requests exceeding SLO)
    alertThresholds: {
        p75_exceeds_target: 0.25, // Alert if 25%+ of p75 exceeds target
        p95_exceeds_warning: 0.05, // Alert if 5%+ of p95 exceeds warning
    },
};

export type PerformanceMetric = keyof typeof performanceSLOs;
export type SLOConfig = typeof performanceSLOs[PerformanceMetric];
