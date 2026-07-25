'use client';

import type { ReactNode, MouseEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface BackLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

function queueScrollRestore(routeKey: string, scrollY: string) {
  window.sessionStorage.setItem(`scroll:${routeKey}`, scrollY);
  window.sessionStorage.setItem(`scroll-target:${routeKey}`, scrollY);
}

function queueItemRestore(routeKey: string) {
  const itemKey = `scroll-target-item:${routeKey}`;
  const savedItem = window.sessionStorage.getItem(itemKey);

  if (savedItem != null) {
    window.sessionStorage.setItem(itemKey, savedItem);
  }
}

export function BackLink({ href, className, children }: BackLinkProps) {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (typeof window === 'undefined') return;

    event.preventDefault();

    const url = new URL(href, window.location.origin);
    const routeKey = `${url.pathname}${url.search}`;
    const storageKey = `scroll:${routeKey}`;
    const storedScrollY = window.sessionStorage.getItem(storageKey);

    if (storedScrollY != null) {
      queueScrollRestore(routeKey, storedScrollY);
      queueItemRestore(routeKey);
    }

    router.replace(href, { scroll: false });
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}