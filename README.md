# Michael Borntreger — Headless Portfolio Starter

Stack: Next.js 14 (App Router) + WPGraphQL + ISR + Draft Previews + On-demand Revalidate.

## Quickstart
1. Copy `.env.example` to `.env.local` and fill values.
2. `npm install`
3. `npm run dev` → http://localhost:3000

## Revalidate
POST to `/api/revalidate?secret=REVALIDATE_SECRET` with `{ "path": "/projects/your-slug" }` or `{ "tag": "home" }`.

## Preview
`/api/preview?type=project&slug=your-slug` (or `type=post`)
