import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIRECTORY = path.join(process.cwd(), 'src/content/blog');

export type BlogPostMetadata = {
  title: string;
  category: string;
  date: string;
  excerpt: string;
  slug: string;
};

export type BlogPost = {
  metadata: BlogPostMetadata;
  content: string;
};

export function getPostSlugs(): string[] {
  try {
    return fs.readdirSync(POSTS_DIRECTORY).filter((file) => file.endsWith('.mdx'));
  } catch (error) {
    console.error("Error reading posts directory", error);
    return [];
  }
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const realSlug = slug.replace(/\.mdx$/, '');
    const fullPath = path.join(POSTS_DIRECTORY, `${realSlug}.mdx`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      metadata: {
        ...data,
        slug: realSlug,
      } as BlogPostMetadata,
      content,
    };
  } catch (error) {
    console.error(`Error reading post with slug: ${slug}`, error);
    return null;
  }
}

export function getAllPosts(): BlogPost[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is BlogPost => post !== null)
    .sort((post1, post2) => (post1.metadata.date > post2.metadata.date ? -1 : 1));
  
  return posts;
}
