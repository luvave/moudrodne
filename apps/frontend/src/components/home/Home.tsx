import { Box, Breakpoint, Button, DescriptionText, DisclosureBasic, HeadingText, Image, SpeechBubble, useBreakpoint } from '@moudrodne/ui';
import GrandmaImage from '../../assets/grandma.png';
import { useTranslation } from 'react-i18next';

export const Home = () => {
  const { isAtLeast } = useBreakpoint();
  const { t } = useTranslation();

  return (
    <Box variant={isAtLeast(Breakpoint.lg) ? 'row' : 'column'}>
      <SpeechBubble point={isAtLeast(Breakpoint.lg) ? 'right' : 'bottom'}>
        <Box variant="column">
          <HeadingText
            text="Kdo ví zná, kdo nezná pozná!"
            enableAnimation
          />
          <DisclosureBasic
            trigger={<Button variant="secondary">{`${t('home.explanationBtn')} ⇨`}</Button>}
            content={<DescriptionText text="Nejstarší lidové moudro světa, vypravuje o tom, že člověk který ví, už to poznal, ale ten, kdo to nepoznal to nemůže vědět." />}
          />
        </Box>
      </SpeechBubble>
      <Image
        src={GrandmaImage}
        alt="test"
        float={isAtLeast(Breakpoint.lg) ? 'right' : 'none'}
      />
    </Box>
  );
};
