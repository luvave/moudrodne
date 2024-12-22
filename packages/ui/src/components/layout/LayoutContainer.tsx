import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  backgroundImage?: string | ReactNode;
}

export const LayoutContainer = ({ children, backgroundImage }: Props) => {
  return (
    <div>
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="relative flex flex-col min-h-screen bg-cover bg-center">{children}</div>
    </div>
  );
};
