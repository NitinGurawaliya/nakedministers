'use client';

import { useLayoutEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function getRouteKey(pathname: string, search: string) {
  return `${pathname}${search ? `?${search}` : ''}`;
}

function getScrollStorageKey(routeKey: string) {
  return `scroll:${routeKey}`;
}

function getScrollTargetKey(routeKey: string) {
  return `scroll-target:${routeKey}`;
}

function getScrollTargetItemKey(routeKey: string) {
  return `scroll-target-item:${routeKey}`;
}

export function useScrollRestoration(routeKey?: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [ready, setReady] = useState(false);
  const resolvedRouteKey =
    routeKey ?? getRouteKey(pathname, searchParams.toString());

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const storageKey = getScrollStorageKey(resolvedRouteKey);
    const targetKey = getScrollTargetKey(resolvedRouteKey);
    const targetItemKey = getScrollTargetItemKey(resolvedRouteKey);

    const saveScrollPosition = () => {
      window.sessionStorage.setItem(storageKey, String(window.scrollY));
    };

    const restoreTarget = window.sessionStorage.getItem(targetKey);
    const restoreTargetItem = window.sessionStorage.getItem(targetItemKey);

    setReady(false);

    if (restoreTarget == null) {
      setReady(true);
      window.addEventListener('scroll', saveScrollPosition, { passive: true });

      return () => {
        window.removeEventListener('scroll', saveScrollPosition);
      };
    }

    const targetY = Number(restoreTarget);
    const targetElementId = restoreTargetItem ? `card-${restoreTargetItem}` : null;

    const tryElementRestore = () => {
      if (!targetElementId) return false;

      const element = document.getElementById(targetElementId);

      if (!element) return false;

      element.scrollIntoView({ block: 'center', behavior: 'auto' });
      return true;
    };

    const restoreScrollPosition = () => {
      if (!tryElementRestore()) {
        window.scrollTo({ top: targetY, behavior: 'auto' });
      }
    };

    window.sessionStorage.removeItem(targetKey);
    window.sessionStorage.removeItem(targetItemKey);

    restoreScrollPosition();
    setReady(true);

    const timeoutId = window.setTimeout(restoreScrollPosition, 150);

    window.addEventListener('scroll', saveScrollPosition, { passive: true });

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('scroll', saveScrollPosition);
    };
  }, [resolvedRouteKey]);

  const navigateWithPreservedScroll = (href: string, itemId?: string | number) => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(
        getScrollStorageKey(resolvedRouteKey),
        String(window.scrollY)
      );

      if (itemId != null) {
        window.sessionStorage.setItem(
          getScrollTargetItemKey(resolvedRouteKey),
          String(itemId)
        );
      } else {
        window.sessionStorage.removeItem(getScrollTargetItemKey(resolvedRouteKey));
      }

    }

    router.push(href, { scroll: true });
  };

  return { navigateWithPreservedScroll, ready };
}