import Link from 'next/link';
import { TypographyH1, TypographyLead } from '@/components/components/ui/typography';

export const revalidate = 3600;

export default function AboutPage() {
  return (
    <article className="space-y-2">
      {/* Intro */}
      <header className="space-y-6">
        <div className="pt-2">
          <Link href="/" className="link text-sm">← Back home</Link>
        </div>
        <TypographyH1 className="text-4xl">About</TypographyH1>
        <TypographyLead className="max-w-2xl text-base text-muted-foreground">
          Minimal, dev-y portfolio where I experiment with headless WordPress, Next.js,
          and SEO-minded frontends.
        </TypographyLead>
      </header>
    </article>
  );
}
