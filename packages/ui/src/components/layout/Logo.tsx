import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../../utils';

const logoVariants = cva('pr-1', {
  variants: {
    size: {
      small: 'h-4',
      medium: 'h-10',
      large: 'h-14',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

export interface LogoProps extends VariantProps<typeof logoVariants> {
  src: string;
  alt: string;
  logoText?: string;
}

export const Logo = ({ src, alt, logoText, size }: LogoProps) => {
  return (
    <div className="flex flex-row items-center">
      <img
        src={src}
        className={cn(logoVariants({ size }))}
        alt={alt}
      />
      {typeof logoText !== 'undefined' && <span className="text-xl font-bold h">{logoText}</span>}
    </div>
  );
};
