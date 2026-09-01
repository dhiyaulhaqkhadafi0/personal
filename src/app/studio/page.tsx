import type { Metadata } from 'next';
import BlogStudio from '@/components/studio/BlogStudio';

export const metadata: Metadata = {
  title: 'Blog Studio | Khadafi',
  description: 'Private editorial workspace for khadafidaffa.com.',
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  return <BlogStudio />;
}
