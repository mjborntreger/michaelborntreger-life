// app/blog/[slug]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import FormattedDate from '@/components/FormattedDate';
import { getPostBySlug, listPostSlugs } from '@/lib/wp';

export const revalidate = 600;

// Prebuild recent post pages
export async function generateStaticParams() {
  const slugs = await listPostSlugs(100);
  return slugs.map((slug) => ({ slug }));
}

// SEO from Rank Math via WPGraphQL
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};

  const s = post.seo ?? {};
  const og = s.openGraph ?? {};
  const img = og.image ?? {};

  const title = s.title || post.title;
  const description = s.description || undefined;
  const canonical = s.canonicalUrl || undefined;

  return {
    title,
    description,
    keywords: Array.isArray(s.focusKeywords) ? s.focusKeywords : undefined,
    alternates: { canonical },
    openGraph: {
      title: og.title || title,
      description: og.description || description,
      url: og.url || canonical,
      type: (og.type?.toLowerCase?.() as
        | 'article'
        | 'website'
        | 'book'
        | 'profile'
        | 'music.song'
        | 'music.album'
        | 'music.playlist'
        | 'music.radio_station'
        | 'video.movie'
        | 'video.episode'
        | 'video.tv_show'
        | 'video.other') || 'article',
      siteName: og.siteName,
      locale: og.locale,
      images:
        img?.url || img?.secureUrl
          ? [{ url: img.secureUrl || img.url, width: img.width, height: img.height, type: img.type }]
          : undefined,
      publishedTime: og.articleMeta?.publishedTime || undefined,
      modifiedTime: og.articleMeta?.modifiedTime || undefined,
      section: og.articleMeta?.section || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: og.title || title,
      description: og.description || description,
      images: img?.secureUrl || img?.url ? [img.secureUrl || img.url] : undefined,
    },
  };
}

type PageProps = { params: { slug: string } };

export default async function PostPage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  // ---------- JSON-LD (BlogPosting) ----------
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${BASE_URL}/blog/${params.slug}`;

  const ogImg =
    post.seo?.openGraph?.image?.secureUrl ||
    post.seo?.openGraph?.image?.url ||
    undefined;

  const strip = (html: string) =>
    html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  const description =
    post.seo?.description ||
    (post.contentHtml ? strip(post.contentHtml).slice(0, 300) : undefined);

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: post.seo?.title || post.title,
    name: post.seo?.title || post.title,
    description,
    image: ogImg,
    url,
    datePublished: post.date || undefined,
    dateModified: post.date || undefined,
    inLanguage: 'en',
    author: { '@type': 'Person', name: 'Michael Borntreger', url: BASE_URL },
    publisher: { '@type': 'Person', name: 'Michael Borntreger', url: BASE_URL },
    keywords: Array.isArray(post.seo?.focusKeywords) ? post.seo!.focusKeywords : undefined,
    articleSection: post.seo?.openGraph?.articleMeta?.section || undefined,
  };
  // -------------------------------------------

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogJsonLd, (_k, v) => (v ?? undefined)),
        }}
      />
      <article className="space-y-6">
        <div className="pt-2">
          <Link href="/blog" className="link text-sm">← Back to Blog</Link>
        </div>

        <header className="space-y-2">
          <h1 className="h1">{post.title}</h1>
          {post.date ? <FormattedDate date={post.date} className="muted text-sm" /> : null}
        </header>

        <div
          className="prose prose-neutral max-w-none"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        <footer className="pt-6">
          <Link href="/blog" className="link text-sm">← Back to Blog</Link>
        </footer>
      </article>
    </>
  );
}
