import { NextRequest, NextResponse } from 'next/server';
import { cookies, draftMode } from 'next/headers';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug') || '';
  const type = searchParams.get('type') || 'post';
  draftMode().enable();
  cookies().set('wp-preview', '1', { httpOnly: true, sameSite: 'lax', path: '/' });
  const path = type === 'project' ? `/projects/${slug}` : `/blog/${slug}`;
  return NextResponse.redirect(new URL(path, process.env.NEXT_PUBLIC_SITE_URL));
}
