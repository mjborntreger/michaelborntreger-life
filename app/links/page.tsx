import Link from 'next/link';
import { getLinks } from '@/lib/wp';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import Favicon from '@/components/Favicon';
import { TypographyH1, TypographyLead } from '@/components/components/ui/typography';

export const revalidate = 900;

type Links = Awaited<ReturnType<typeof getLinks>>;

const DEFAULT_BRAND_STYLE = { label: 'text-foreground', icon: 'text-muted-foreground' };
const BRAND_STYLES: Record<string, { label: string; icon: string }> = {
  'github.com': DEFAULT_BRAND_STYLE,
  'linkedin.com': { label: 'text-primary', icon: 'text-primary' },
  'x.com': DEFAULT_BRAND_STYLE,
  'twitter.com': DEFAULT_BRAND_STYLE,
  'youtube.com': { label: 'text-destructive', icon: 'text-destructive' },
  'instagram.com': { label: 'text-accent-foreground', icon: 'text-accent-foreground' },
  'facebook.com': { label: 'text-primary', icon: 'text-primary' },
  'dev.to': DEFAULT_BRAND_STYLE,
  'medium.com': DEFAULT_BRAND_STYLE,
  'npmjs.com': { label: 'text-destructive', icon: 'text-destructive' },
  'vercel.com': DEFAULT_BRAND_STYLE,
  'netlify.com': DEFAULT_BRAND_STYLE,
  'cloudflare.com': { label: 'text-accent-foreground', icon: 'text-accent-foreground' },
  'notion.so': DEFAULT_BRAND_STYLE,
  'figma.com': { label: 'text-primary', icon: 'text-primary' },
  'dribbble.com': { label: 'text-primary', icon: 'text-primary' },
  'behance.net': { label: 'text-primary', icon: 'text-primary' },
};

function getBrand(url: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return BRAND_STYLES[host] ?? DEFAULT_BRAND_STYLE;
  } catch {
    return DEFAULT_BRAND_STYLE;
  }
}

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export default async function LinksPage() {
  const links: Links = await getLinks();

  if (!links?.length) {
    return (
      <div className="space-y-2">
        <div className="pt-2">
          <Link href="/" className="link text-sm">← Back home</Link>
        </div>
        <TypographyH1 className="text-4xl">Links</TypographyH1>
        <TypographyLead className="text-base text-muted-foreground">No links available.</TypographyLead>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-6">
        <div className="pt-2">
          <Link href="/" className="link text-sm">← Back home</Link>
        </div>
        <TypographyH1 className="text-4xl">Links</TypographyH1>
        <TypographyLead className="text-base text-muted-foreground">
          A collection of useful resources & profiles.
        </TypographyLead>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {links.map((l) => {
          const brand = getBrand(l.url);
          return (
            <li key={l.url}>
              <a
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                title={l.url}
                aria-label={`${l.label} (opens in new tab)`}
                className="flex h-full flex-col justify-between rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm transition-shadow hover:bg-accent/50 hover:text-accent-foreground hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Favicon url={l.url} className="rounded" size={16} />
                    <span className={`font-medium ${brand.label}`}>{l.label}</span>
                  </span>
                  <ArrowTopRightOnSquareIcon className={`w-4 h-4 ${brand.icon}`} aria-hidden="true" />
                </div>

                {/* Description (if present), otherwise show hostname */}
                {l.description ? (
                  <p className="mt-1 text-sm text-muted-foreground">{l.description}</p>
                ) : (
                  <span className="mt-1 block truncate text-sm text-muted-foreground">
                    {hostname(l.url)}
                  </span>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
