import { FiMenu } from 'react-icons/fi';
import { Button, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../shadcn';
import { ReactNode } from 'react';

interface Props {
  leftComponent?: ReactNode;
  centerComponent?: ReactNode;
  rightComponent?: ReactNode;
  mobileExtraComponent?: ReactNode;
}

export const Header = ({ rightComponent, centerComponent, mobileExtraComponent, leftComponent }: Props) => {
  return (
    <section className="py-4">
      <header className="w-full">
        <nav className="hidden justify-between lg:flex px-9 pt-2">
          <div className="flex justify-between gap-6">
            <div className="flex items-center gap-2">{leftComponent}</div>
            <div className="flex items-center">{centerComponent}</div>
          </div>
          <div className="flex gap-2">{rightComponent}</div>
        </nav>
        <div className="justify-between flex px-4 lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">{leftComponent}</div>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
              >
                <FiMenu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>
                  <div className="flex items-center gap-2">{leftComponent}</div>
                </SheetTitle>
              </SheetHeader>
              <div className="mb-8 mt-8 flex flex-col gap-4">{centerComponent}</div>
              <div className="mt-2 flex flex-col gap-3">{rightComponent}</div>
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 justify-start">{mobileExtraComponent}</div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </section>
  );
};
