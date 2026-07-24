'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/data';

interface CandidatePhotoProps {
  photoUrl: string | null | undefined;
  name: string;
  size?: number;
  className?: string;
  rounded?: 'full' | '2xl';
}

const AVATAR_COLORS = [
  'bg-orange-100 text-orange-800',
  'bg-blue-100 text-blue-800',
  'bg-emerald-100 text-emerald-800',
  'bg-amber-100 text-amber-800',
  'bg-rose-100 text-rose-800',
  'bg-indigo-100 text-indigo-800',
];

function colorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i) * 17) % AVATAR_COLORS.length;
  return AVATAR_COLORS[hash];
}

export function CandidatePhoto({
  photoUrl,
  name,
  size = 64,
  className,
  rounded = 'full',
}: CandidatePhotoProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(photoUrl) && !failed;
  const radius = rounded === 'full' ? 'rounded-full' : 'rounded-2xl';

  if (!showImage) {
    return (
      <div
        className={cn(
          'flex flex-none items-center justify-center font-semibold ring-1 ring-border',
          radius,
          colorForName(name),
          className
        )}
        style={{ width: size, height: size, fontSize: Math.max(12, size * 0.32) }}
        aria-label={name}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative flex-none overflow-hidden bg-muted ring-1 ring-border',
        radius,
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={photoUrl!}
        alt={name}
        fill
        sizes={`${size}px`}
        className="object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
