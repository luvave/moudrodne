import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const Content = ({ children }: Props) => {
  return (
    <section className="py-6 flex-grow flex">
      <main className="text-center flex-grow">{children}</main>
    </section>
  );
};
