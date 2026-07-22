import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, alt, size = 48, className }: AvatarProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-full bg-muted ring-1 ring-border',
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`${size}px`}
        className="object-cover"
      />
    </div>
  );
}
