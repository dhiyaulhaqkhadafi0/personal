"use client";

import { ArticleEngagementBar } from '@/components/blog/ArticleEngagementBar';

type GrimoireMetricsProps = {
  slug: string;
};

/**
 * Legacy wrapper redirecting to real reader engagement (views & likes).
 * Replaced dummy metrics and old sparkles with authentic engagement bar.
 */
export default function GrimoireMetrics({ slug }: GrimoireMetricsProps) {
  return <ArticleEngagementBar slug={slug} />;
}
