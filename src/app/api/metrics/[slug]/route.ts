import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET: Fetch view and ignite count for a slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Attempt to fetch existing record
    const { data, error } = await supabase
      .from('blog_metrics')
      .select('view_count, ignite_count')
      .eq('slug', slug)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching metrics:', error);
      return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
    }

    // If no record exists, return default 0 values
    if (!data) {
      return NextResponse.json({ view_count: 0, ignite_count: 0 }, { status: 200 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Increment view or ignite count for a slug
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Parse the request body to know what to increment ('view' or 'ignite')
    const body = await request.json();
    const { type } = body; // 'view' or 'ignite'

    if (type !== 'view' && type !== 'ignite') {
      return NextResponse.json({ error: 'Invalid type provided' }, { status: 400 });
    }

    // We can use an upsert strategy. Supabase doesn't natively support atomic increments 
    // easily without RPC, but we can do a read, then insert/update. 
    // Wait, the better way for high concurrency without RPC is reading and writing,
    // though ideally an RPC function is used. We'll use simple read/write for this setup.
    
    const { data: existingData, error: fetchError } = await supabase
      .from('blog_metrics')
      .select('view_count, ignite_count')
      .eq('slug', slug)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      return NextResponse.json({ error: 'Failed to fetch existing metrics' }, { status: 500 });
    }

    let newData;
    
    if (!existingData) {
      // Create new row
      newData = {
        slug,
        view_count: type === 'view' ? 1 : 0,
        ignite_count: type === 'ignite' ? 1 : 0
      };
      
      const { data: insertedData, error: insertError } = await supabase
        .from('blog_metrics')
        .insert(newData)
        .select()
        .single();
        
      if (insertError) {
        return NextResponse.json({ error: 'Failed to create metrics row' }, { status: 500 });
      }
      return NextResponse.json(insertedData, { status: 200 });
    } else {
      // Update existing row
      newData = {
        view_count: type === 'view' ? Number(existingData.view_count) + 1 : Number(existingData.view_count),
        ignite_count: type === 'ignite' ? Number(existingData.ignite_count) + 1 : Number(existingData.ignite_count)
      };
      
      const { data: updatedData, error: updateError } = await supabase
        .from('blog_metrics')
        .update(newData)
        .eq('slug', slug)
        .select()
        .single();
        
      if (updateError) {
        return NextResponse.json({ error: 'Failed to update metrics' }, { status: 500 });
      }
      return NextResponse.json(updatedData, { status: 200 });
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
