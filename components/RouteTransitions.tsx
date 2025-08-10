'use client';
import { usePathname } from 'next/navigation';
import PageTransition, { type TransitionVariant } from '@/components/PageTransitions';
import type { Easing } from 'framer-motion';

export default function RouteTransitions({
  children,
  variant = 'slideUp',   // global default
  duration,
  ease,
}: {
  children: React.ReactNode;
  variant?: TransitionVariant;
  duration?: number;
  ease?: Easing | Easing[];
}) {
  const pathname = usePathname();
  // Re-run the animation on every route change
  return (
    <PageTransition key={pathname} variant={variant} duration={duration} ease={ease}>
      {children}
    </PageTransition>
  );
}
