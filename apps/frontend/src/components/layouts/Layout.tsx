import { Outlet } from 'react-router-dom';
import { Button, Content, Footer, Header, LayoutContainer, SocialLinksSection } from '@moudrodne/ui';
import { MoudroDneLogo } from './layoutComponents/MoudroDneLogo';
import { useTranslation } from 'react-i18next';
import backgroundImage from '../../assets/background.png';

export const Layout = () => {
  const { t } = useTranslation();

  return (
    <LayoutContainer backgroundImage={backgroundImage}>
      <Header
        leftComponent={<MoudroDneLogo />}
        rightComponent={
          <>
            <Button variant="outline">{t('layout.header.login')}</Button>
            <Button>{t('layout.header.signup')}</Button>
          </>
        }
      />
      <Content>
        <Outlet />
      </Content>
      <Footer
        leftPrimaryComponent={<MoudroDneLogo size="large" />}
        leftSecondaryComponent={t('layout.footer.description')}
        socialLinksComponent={
          <SocialLinksSection
            linkedinUrl={import.meta.env.VITE_LINKEDIN_URL ?? ''}
            githubUrl={import.meta.env.VITE_GITHUB_URL ?? ''}
          />
        }
        bottomComponent={<p>{t('layout.footer.copyright')}</p>}
      />
    </LayoutContainer>
  );
};
