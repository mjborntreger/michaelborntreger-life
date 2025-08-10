import Link from 'next/link';
export const revalidate = 3600;

export default function AboutPage() {
  return (
    <article className="space-y-2">
      {/* Intro */}
      <header className="space-y-6">
        <div className="pt-2">
             <Link href="/" className="link text-sm">← Back home</Link>
            </div>
        <h1 className="h1">About</h1>
        <p className="muted max-w-2xl">
          Minimal, dev-y portfolio where I experiment with headless WordPress, Next.js,
          and SEO-minded frontends.
        </p>
      </header>
    </article>
  );
}
