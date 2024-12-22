import { Disclosure, DisclosureTrigger, DisclosureContent } from '../shadcn';
import { ReactNode } from 'react';

interface Props {
  trigger: ReactNode;
  content: ReactNode;
}

export const DisclosureBasic = ({ trigger, content }: Props) => {
  return (
    <Disclosure>
      <DisclosureTrigger>{trigger}</DisclosureTrigger>
      <DisclosureContent>{content}</DisclosureContent>
    </Disclosure>
  );
};
