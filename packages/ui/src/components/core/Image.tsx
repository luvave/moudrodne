import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils';
import { ImgHTMLAttributes } from 'react';

const imageVariants = cva('', {
  variants: {
    float: {
      none: '',
      right: 'absolute xl:right-32 lg:right-5 top-1/2 transform -translate-y-2/4',
      bottom: 'absolute bottom-[-70px] left-1/2 transform -translate-x-1/2',
    },
    size: {
      small: 'h-28',
      medium: 'h-1/2',
      large: 'h-1',
    },
  },
  defaultVariants: {
    float: 'none',
    size: 'medium',
  },
});

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement>, VariantProps<typeof imageVariants> {
  src: string;
  alt: string;
}

const Image = ({ className, children, src, alt, float, size, ...props }: ImageProps) => {
  return (
    <img
      className={cn(imageVariants({ float, size }), className)}
      src={src}
      alt={alt}
      {...props}
    >
      {children}
    </img>
  );
};

export { Image, imageVariants };
