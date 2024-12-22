import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils';

const variants = cva('text-balance text-muted-foreground lg:text-lg', {
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
}
export const DescriptionText = ({ text, backgroundStyle }: Props) => {
  return <p className={cn(variants({ backgroundStyle }))}>{text}</p>;
};
