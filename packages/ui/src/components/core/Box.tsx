import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils';

const boxVariants = cva('mx-auto max-w-screen-lg flex', {
  variants: {
    variant: {
      column: 'flex-col gap-6',
      row: 'flex-row gap-5',
    },
    align: {
      center: 'items-center justify-center',
    },
    height: {
      auto: 'h-full',
      large: 'h-96',
    },
  },
  defaultVariants: {
    variant: 'row',
    align: 'center',
    height: 'auto',
  },
});

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof boxVariants> {}

const Box = ({ className, children, variant, height, align, ...props }: BoxProps) => {
  return (
    <div
      className={cn(boxVariants({ variant, height, align }), className)}
      {...props}
    >
      {children}
    </div>
  );
};

export { Box, boxVariants };
