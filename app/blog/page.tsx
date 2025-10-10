import Link from 'next/link';
import { listRecentPosts } from '@/lib/wp';
import FormattedDate from '@/components/FormattedDate';
import { Card } from '@/components/components/ui/card';
import { TypographyH1, TypographyH2, TypographyLead } from '@/components/components/ui/typography';

export const revalidate = 600; // ISR

export const metadata = {
  title: 'Blog',
  description: 'Notes and posts by Michael Borntreger.',
};

type Posts = Awaited<ReturnType<typeof listRecentPosts>>;

export default async function BlogIndex() {
  const posts: Posts = await listRecentPosts(20);

  if (!posts?.length) {
    return (
      <div className="space-y-2">
        <div className="pt-2">
          <Link href="/" className="link text-sm">← Back home</Link>
        </div>
        <TypographyH1 className="text-4xl">Blog</TypographyH1>
        <TypographyLead className="text-base text-muted-foreground">No posts yet.</TypographyLead>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-6">
        <div className="pt-2">
          <Link href="/" className="link text-sm">← Back home</Link>
        </div>
        <TypographyH1 className="text-4xl">Blog</TypographyH1>
        <TypographyLead className="text-base text-muted-foreground">Latest posts.</TypographyLead>
      </header>

      <ul className="space-y-3">
        {posts.map((p) => (
          <li key={p.slug}>
            <Card className="p-5 transition-shadow hover:shadow-md">
              <TypographyH2 className="text-lg font-semibold">
                <Link href={`/blog/${p.slug}`} className="link">
                  {p.title}
                </Link>
              </TypographyH2>
              <FormattedDate date={p.date} />
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
