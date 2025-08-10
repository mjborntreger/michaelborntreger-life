import Link from 'next/link';
import { getPostBySlug, listPostSlugs } from '@/lib/wp';
import { notFound } from 'next/navigation';
import FormattedDate from '@/components/FormattedDate';

export const revalidate = 600;

// Prebuild recent post pages
export async function generateStaticParams() {
  const slugs = await listPostSlugs(100); // adjust as needed
  return slugs.map((slug) => ({ slug }));
}

type PageProps = { params: { slug: string } };

export default async function PostPage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  return (
    <article className="space-y-6">
      <div className="pt-2">
           <Link href="/blog" className="link text-sm">← Back to Blog</Link>
          </div>
      <header className="space-y-2">
        <h1 className="h1">{post.title}</h1>
        <FormattedDate date={post.date} className="muted text-sm" />
      </header>

      {/* Post body */}
      <div
        className="prose prose-neutral max-w-none"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      {/* Footer nav */}
      <footer className="pt-6">
        <Link href="/blog" className="link text-sm">
          ← Back to Blog
        </Link>
      </footer>
    </article>
  );
}
