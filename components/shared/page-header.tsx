"use client";

import { SectionHeader } from "./section-header";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return <SectionHeader title={title} subtitle={subtitle} />;
}

