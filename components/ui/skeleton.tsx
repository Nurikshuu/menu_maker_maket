/**
 * Skeleton — animated placeholder used while async content loads.
 * Accepts className to control size/shape at the call-site.
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200', className)}
      {...props}
    />
  );
}
