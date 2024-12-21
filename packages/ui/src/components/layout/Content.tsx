import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const Content = ({ children }: Props) => {
  return (
    <section className="py-32">
      <main className="container text-center">{children}</main>
    </section>
  );
};
