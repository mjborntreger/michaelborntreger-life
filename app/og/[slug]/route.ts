import { ImageResponse } from 'next/og';
export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (<div style={{ fontSize: 48, padding: 80 }}>Michael Borntreger</div>),
    { width: 1200, height: 630 }
  );
}
