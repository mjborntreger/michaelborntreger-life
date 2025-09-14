import { ImageResponse } from 'next/og';

export const runtime = 'edge'; // ok to keep

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  return new ImageResponse(
    (
      <div style={{ fontSize: 48, padding: 80 }}>
        {slug ? `Michael Borntreger • ${slug}` : 'Michael Borntreger'}
      </div>
    ),
    { width: 1200, height: 630 } // pass size here, not as exports
  );
}
