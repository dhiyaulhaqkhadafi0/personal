import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET: Fetch comments for a slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const { data, error } = await supabase
      .from('blog_comments')
      .select('id, user_name, content, created_at')
      .eq('slug', slug)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
      // Return empty array instead of 500 so UI doesn't crash if table doesn't exist yet
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(data || [], { status: 200 });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json([], { status: 200 });
  }
}

// POST: Add a new comment for a slug
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { user_name, content } = body;

    if (!user_name || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const { data, error } = await supabase
      .from('blog_comments')
      .insert({ slug, user_name, content })
      .select('id, user_name, content, created_at')
      .single();

    if (error) {
      console.error('Error inserting comment:', error);
      return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
