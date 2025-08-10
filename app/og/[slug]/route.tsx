import { ImageResponse } from 'next/og';

// (optional but nice)
export const runtime = 'edge';
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

// If you want the slug, accept it from params:
export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  return new ImageResponse(
    (
      <div style={{ fontSize: 48, padding: 80 }}>
        {slug ? `Michael Borntreger • ${slug}` : 'Michael Borntreger'}
      </div>
    ),
    size
  );
}
