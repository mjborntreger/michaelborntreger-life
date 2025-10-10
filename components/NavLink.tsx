'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(' ');
}

// Grab the exact href type that <Link> expects
type Href = Parameters<typeof Link>[0]['href'];

type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: Href;
  children: React.ReactNode;
  startsWith?: boolean;
  externalNewTab?: boolean;
  activeClassName?: string;
};

export default function NavLink({
  href,
  children,
  className,
  startsWith = false,
  externalNewTab = true,
  activeClassName = 'text-foreground font-semibold underline underline-offset-4',
  ...rest
}: Props) {
  const pathname = usePathname() || '/';

  // normalize href to a string for comparisons / external <a>
  const hrefStr =
    typeof href === 'string'
      ? href
      : href instanceof URL
      ? href.pathname + href.search + href.hash
      : 'pathname' in href && href.pathname
      ? href.pathname
      : String(href);

  const isInternal = hrefStr.startsWith('/');

  const isActive = isInternal
    ? (startsWith ? pathname.startsWith(hrefStr) : pathname === hrefStr)
    : false;

  if (isInternal) {
    return (
      <Link href={href} className={cx(className, isActive && activeClassName)} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={hrefStr}
      target={externalNewTab ? '_blank' : undefined}
      rel={externalNewTab ? 'noopener noreferrer' : undefined}
      className={className}
      {...rest}
    >
      {children}
    </a>
  );
}
