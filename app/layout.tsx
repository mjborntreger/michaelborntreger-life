import './globals.css';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import { ThemeProvider } from '@/components/theme-provider';
import NavLink from '@/components/NavLink';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'Michael Borntreger', template: '%s • Michael Borntreger' },
  description: 'Portfolio, projects, and experiments by Michael Borntreger.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen antialiased bg-background text-foreground">
        <ThemeProvider defaultTheme="system" storageKey="theme">
          <a
            href="#content"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors border rounded-lg sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 whitespace-nowrap border-border bg-background hover:bg-accent/60 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Skip to content
          </a>

          <header className="sticky top-0 z-40 border-b border-border/80 bg-background/70 backdrop-blur">
            <div className="flex items-center justify-between w-full max-w-5xl px-5 mx-auto h-14">
              <NavLink className="text-base font-semibold tracking-wide" href="/">MB</NavLink>
              <nav className="flex flex-wrap items-center gap-3">
                <NavLink href="/projects" className="nav-link">Projects</NavLink>
                <NavLink href="/blog" className="nav-link">Blog</NavLink>
                <NavLink href="/links" className="nav-link">Links</NavLink>
                <NavLink href="/about" className="nav-link">About</NavLink>
                <NavLink href="/contact" className="nav-link">Contact</NavLink>
                <ThemeToggle />
              </nav>
            </div>
          </header>

          <main id="content" className="w-full max-w-5xl px-5 py-10 mx-auto">{children}</main>

          <footer className="w-full max-w-5xl mx-auto border-t border-border/80">
            <div className="flex justify-between px-5 py-10">
              <div className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Michael Borntreger
              </div>
              <div className="text-sm text-muted-foreground">
                <Link
                  href="/jodi-quotient"
                >
                  Jodi Quotient
                </Link>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
