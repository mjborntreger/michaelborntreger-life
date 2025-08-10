import Link from 'next/link';
import { listRecentPosts } from '@/lib/wp';
import FormattedDate from '@/components/FormattedDate';

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
        <h1 className="h1">Blog</h1>
        <p className="muted">No posts yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-6">
        <div className="pt-2">
             <Link href="/" className="link text-sm">← Back home</Link>
            </div>
        <h1 className="h1">Blog</h1>
        <p className="muted">Latest posts.</p>
      </header>

      <ul className="space-y-3">
        {posts.map((p) => (
          <li key={p.slug}>
            <article className="card shadow-hover p-5">
              <h2 className="text-lg font-semibold">
                <Link href={`/blog/${p.slug}`} className="link">
                  {p.title}
                </Link>
              </h2>
              <FormattedDate date={p.date} />
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
