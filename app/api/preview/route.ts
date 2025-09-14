import { NextRequest, NextResponse } from 'next/server';
import { draftMode } from 'next/headers';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug') || '';
  const type = searchParams.get('type') || 'post';
  const dm = await draftMode();
  dm.enable();
  const path = type === 'project' ? `/projects/${slug}` : `/blog/${slug}`;
  const res = NextResponse.redirect(new URL(path, process.env.NEXT_PUBLIC_SITE_URL));
  res.cookies.set('wp-preview', '1', { httpOnly: true, sameSite: 'lax', path: '/' });
  return res;
}
