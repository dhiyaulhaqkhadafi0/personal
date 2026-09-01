import { getPostBySlug, getPostSlugs } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import BlogPostContent from '@/components/blog/BlogPostContent';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.metadata.title} | Digital Grimoire`,
    description: post.metadata.excerpt,
  };
}

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug: slug.replace(/\.mdx$/, '') }));
}

// Custom heading components that attach unique id for smooth ToC navigation
const mdxComponents = {
  h2: ({ children, ...props }: any) => {
    const text = typeof children === "string" ? children : Array.isArray(children) ? children.join("") : String(children || "");
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    return (
      <h2 id={id} className="scroll-mt-36" {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }: any) => {
    const text = typeof children === "string" ? children : Array.isArray(children) ? children.join("") : String(children || "");
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
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <BlogPostContent post={post} slug={slug}>
      <MDXRemote source={post.content} components={mdxComponents} />
    </BlogPostContent>
  );
}
