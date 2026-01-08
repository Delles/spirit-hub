interface FAQItem {
    question: string;
    answer: string;
}

/**
 * Generate FAQPage JSON-LD schema from FAQ items
 * @param faqs - Array of question/answer pairs
 * @returns FAQPage JSON-LD object ready for injection
 */
export function generateFAQJsonLd(faqs: FAQItem[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };
}

export type { FAQItem };
