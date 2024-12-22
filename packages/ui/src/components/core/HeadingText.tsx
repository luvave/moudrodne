import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../../utils';
import { TextEffect } from '../shadcn';

const variants = cva('text-3xl font-extrabold lg:text-6xl', {
  variants: {
    backgroundStyle: {
      transparent: '',
      white: 'bg-secondary/95',
    },
  },
  defaultVariants: {
    backgroundStyle: 'transparent',
  },
});

interface Props extends VariantProps<typeof variants> {
  text: string;
  enableAnimation?: boolean;
}

export const HeadingText = ({ text, backgroundStyle, enableAnimation }: Props) => {
  return (
    <h1 className={cn(variants({ backgroundStyle }))}>
      {enableAnimation === true ? (
        <TextEffect
          per="word"
          as="p"
          preset="blur"
          trigger={true}
        >
          {text}
        </TextEffect>
      ) : (
        text
      )}
    </h1>
  );
};
