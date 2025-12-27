"use client";

import dynamic from "next/dynamic";
import type { Components } from "react-markdown";

// Dynamic import - only loads when component is rendered
const ReactMarkdownLazy = dynamic(
    () => import("react-markdown").then((mod) => mod.default),
    {
        loading: () => (
            <span className="animate-pulse text-slate-400">...</span>
        ),
        ssr: true, // Still render on server for SEO
    }
);

// Memoized markdown components - defined outside component to avoid re-creation
export const MARKDOWN_COMPONENTS: Components = {
    p: ({ children }) => (
        <p className="text-slate-300 leading-relaxed mb-4 last:mb-0">{children}</p>
    ),
    strong: ({ children }) => (
        <strong className="text-white font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
};

interface MarkdownProps {
    children: string;
    components?: Components;
    className?: string;
}

/**
 * Dynamic Markdown component that lazy-loads react-markdown
 * Reduces initial bundle by ~35KB on pages that don't use markdown
 */
export function Markdown({
    children,
    components = MARKDOWN_COMPONENTS,
    className,
}: MarkdownProps) {
    return (
        <div className={className}>
            <ReactMarkdownLazy components={components}>{children}</ReactMarkdownLazy>
        </div>
    );
}

// Re-export for convenience
export { type Components } from "react-markdown";
