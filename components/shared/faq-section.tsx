"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FAQItem } from "@/lib/faq-schema";

// Re-export for backwards compatibility (but server components should import from @/lib/faq-schema)
export { generateFAQJsonLd, type FAQItem } from "@/lib/faq-schema";

interface FAQSectionProps {
    title?: string;
    faqs: FAQItem[];
    className?: string;
}

/**
 * FAQ Section component with accordion-style expandable items
 * Designed to be used with FAQPage JSON-LD schema for SEO benefits
 */
export function FAQSection({ title = "Întrebări Frecvente", faqs, className }: FAQSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleItem = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className={cn("w-full", className)}>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">{title}</h2>
            <div className="space-y-3">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="rounded-xl border border-white/10 bg-black/20 overflow-hidden"
                    >
                        <button
                            onClick={() => toggleItem(index)}
                            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                            aria-expanded={openIndex === index}
                        >
                            <span className="text-white font-medium pr-4">{faq.question}</span>
                            <ChevronDown
                                className={cn(
                                    "w-5 h-5 text-[#9F2BFF] flex-shrink-0 transition-transform duration-200",
                                    openIndex === index && "rotate-180"
                                )}
                            />
                        </button>
                        <div
                            className={cn(
                                "overflow-hidden transition-all duration-200 ease-in-out",
                                openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                            )}
                        >
                            <div className="px-5 pb-4 text-[#E0E0E0] leading-relaxed">
                                {faq.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
