/**
 * Badge — small label chip used for restaurant categories,
 * promo labels, and status indicators.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-blue-100 text-blue-700',
        secondary: 'bg-gray-100 text-gray-600',
        success: 'bg-green-100 text-green-700',
        destructive: 'bg-red-100 text-red-700',
        outline: 'border border-gray-200 text-gray-600',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
