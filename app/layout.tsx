import './globals.css';
import RouteTransitions from '@/components/RouteTransitions';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NavLink from '@/components/NavLink';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'Michael Borntreger', template: '%s • Michael Borntreger' },
  description: 'Portfolio, projects, and experiments by Michael Borntreger.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-neutral-50 text-neutral-900 antialiased">
        <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 btn-ghost ring-focus">
          Skip to content
        </a>

        <header className="sticky top-0 z-40 border-b border-neutral-100 bg-white/80 backdrop-blur shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="wrap h-14 flex items-center justify-between">
            <NavLink className="font-semibold tracking-wide" href="/">MB</NavLink>
            <nav className="space-x-5">
              <NavLink href="/projects" className="nav-link">Projects</NavLink>
              <NavLink href="/blog" className="nav-link">Blog</NavLink>
              <NavLink href="/links" className="nav-link">Links</NavLink>
              <NavLink href="/about" className="nav-link">About</NavLink>
              <NavLink href="/contact" className="nav-link">Contact</NavLink>
            </nav>
          </div>
        </header>

        <main id="content" className="wrap py-10">
          <RouteTransitions variant="zoom">{children}</RouteTransitions>
        </main>

        <footer className="border-t border-neutral-100">
          <div className="wrap py-10 text-sm text-neutral-500">
            © {new Date().getFullYear()} Michael Borntreger
          </div>
        </footer>
      </body>
    </html>
  );
}
