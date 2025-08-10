import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }
  try {
    const body = await req.json();
    if (body?.path) {
      const { revalidatePath } = await import('next/cache');
      revalidatePath(body.path);
    }
    if (body?.tag) {
      const { revalidateTag } = await import('next/cache');
      revalidateTag(body.tag);
    }
    return NextResponse.json({ revalidated: true });
  } catch (e) {
    return NextResponse.json({ message: 'Bad request', error: String(e) }, { status: 400 });
  }
}
