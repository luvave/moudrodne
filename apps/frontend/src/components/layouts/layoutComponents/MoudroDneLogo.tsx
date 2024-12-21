import GrandmaSvg from '../../../assets/elderly-grandmother-icon.svg';
import { useTranslation } from 'react-i18next';
import { Logo, LogoProps } from '@moudrodne/ui';
import { Link } from 'react-router-dom';

export const MoudroDneLogo = (props: Omit<LogoProps, 'alt' | 'src'>) => {
  const { t } = useTranslation();

  return (
    <Link to="#">
      <Logo
        alt={t('layout.logoText')}
        src={GrandmaSvg}
        logoText={t('layout.logoText')}
        size="medium"
        {...props}
      />
    </Link>
  );
};
