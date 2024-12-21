import { ReactNode } from 'react';

interface Props {
  leftPrimaryComponent?: ReactNode;
  leftSecondaryComponent?: ReactNode;
  rightComponent?: ReactNode;
  socialLinksComponent?: ReactNode;
  bottomComponent?: ReactNode;
}

export const Footer = ({ leftPrimaryComponent, leftSecondaryComponent, socialLinksComponent, rightComponent, bottomComponent }: Props) => {
  return (
    <section className="py-4 bg-secondary">
      <div className="container mx-auto">
        <footer>
          <div className="flex flex-col items-center justify-between gap-10 text-center lg:flex-row lg:text-left">
            <div className="flex w-full max-w-96 shrink flex-col items-center justify-between gap-6 lg:items-start">
              <div>
                <span className="flex items-center justify-center gap-4 lg:justify-start">{leftPrimaryComponent}</span>
                <p className="mt-6 text-sm text-muted-foreground">{leftSecondaryComponent}</p>
              </div>
              <ul className="flex items-center space-x-6 text-muted-foreground">{socialLinksComponent}</ul>
            </div>
            <div className="grid grid-cols-3 gap-6 lg:gap-20">{rightComponent}</div>
          </div>
          <div className="mt-10 flex flex-col gap-4 border-t pt-4 text-center text-sm font-medium text-muted-foreground lg:flex-row lg:items-center lg:text-left">{bottomComponent}</div>
        </footer>
      </div>
    </section>
  );
};
