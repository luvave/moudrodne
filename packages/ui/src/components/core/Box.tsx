import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils';

const boxVariants = cva('mx-auto max-w-screen-lg flex', {
  variants: {
    variant: {
      column: 'flex-col gap-6',
      row: 'flex-row gap-5',
    },
  },
  defaultVariants: {
    variant: 'row',
  },
});

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof boxVariants> {}

const Box = ({ className, children, variant, ...props }: BoxProps) => {
  return (
    <div
      className={cn(boxVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  );
};

export { Box, boxVariants };
