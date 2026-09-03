import { getPublishedPostBySlug, getPostSlugs } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import BlogPostContent from '@/components/blog/BlogPostContent';
import { addHeadingIds, tiptapHeadingsToMarkdown } from '@/lib/blog-types';
import type { HTMLAttributes, ReactNode } from 'react';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  
  if (!post) {
    return { title: 'Post Not Found' };
  }

  const title = `${post.metadata.title} | Digital Grimoire`;
  const description = post.metadata.excerpt;
  const coverImage = post.metadata.cover_url || post.metadata.image;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: coverImage ? [{ url: coverImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: coverImage ? [coverImage] : undefined,
    },
  };
}

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug: slug.replace(/\.mdx$/, '') }));
}

// Custom heading components that attach unique id for smooth ToC navigation
function headingText(children: ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(headingText).join('');
  return '';
}

const mdxComponents = {
  h2: ({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) => {
    const text = headingText(children);
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    return (
      <h2 id={id} className="scroll-mt-36" {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) => {
    const text = headingText(children);
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    return (
      <h3 id={id} className="scroll-mt-36" {...props}>
        {children}
      </h3>
    );
  },
};

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  if (post.source === 'studio') {
    const tocContent = post.contentJson ? tiptapHeadingsToMarkdown(post.contentJson) : '';
    return <BlogPostContent post={{ ...post, content: tocContent }} slug={slug}>
      <div dangerouslySetInnerHTML={{ __html: addHeadingIds(post.contentHtml || '') }} />
    </BlogPostContent>;
  }

  return <BlogPostContent post={post} slug={slug}>
    <MDXRemote source={post.content} components={mdxComponents} />
  </BlogPostContent>;
}
