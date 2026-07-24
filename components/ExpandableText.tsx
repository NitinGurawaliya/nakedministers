'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
  className?: string;
}

export function ExpandableText({
  text,
  maxLength = 150,
  className,
}: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const needsTruncate = text.length > maxLength;

  if (!needsTruncate) {
    return <p className={cn('text-sm leading-relaxed text-foreground', className)}>{text}</p>;
  }

  return (
    <div className={className}>
      <p className="text-sm leading-relaxed text-foreground">
        {expanded ? text : `${text.slice(0, maxLength).trim()}…`}
      </p>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-1 text-xs font-medium text-primary hover:underline"
      >
        {expanded ? 'Show less' : 'Show more'}
      </button>
    </div>
  );
}
