import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ALLOWLIST = [
  'https://michaelborntreger.life',
  'https://staging.michaelborntreger.life',
  'http://localhost:3000',
];

// Accept preview deployments for this project only:
// e.g. https://michaelborntreger-life-somehash-someowner.vercel.app
function isAllowedOrigin(origin: string | null) {
  if (!origin) return false;
  if (ALLOWLIST.includes(origin)) return true;
  try {
    const url = new URL(origin);
    const host = url.hostname;
    // allow any subdomain that starts with your project name and ends with .vercel.app
    if (/^michaelborntreger-life-.*\.vercel\.app$/.test(host)) return true;
  } catch {}
  return false;
}

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Only add CORS on API routes
  if (req.nextUrl.pathname.startsWith('/api/')) {
    const origin = req.headers.get('origin');
    if (isAllowedOrigin(origin)) {
      res.headers.set('Access-Control-Allow-Origin', origin!);
      res.headers.set('Vary', 'Origin');
      res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      // No credentials since you’re not using cookies/JWT
    }
    // Handle preflight
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: res.headers });
    }
  }

  return res;
}

export const config = {
  // Apply middleware to API only (adjust if you want site-wide CORS)
  matcher: ['/api/:path*'],
};
