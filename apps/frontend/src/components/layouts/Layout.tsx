import { Outlet } from 'react-router-dom';
import { Button, Content, Footer, Header, SocialLinksSection } from '@moudrodne/ui';
import { MoudroDneLogo } from './layoutComponents/MoudroDneLogo';
import { useTranslation } from 'react-i18next';

export const Layout = () => {
  const { t } = useTranslation();

  return (
    <>
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
            linkedinUrl="https://www.linkedin.com/in/luk%C3%A1%C5%A1-v%C3%A9var-b01533252/"
            githubUrl="https://github.com/luvave"
          />
        }
        bottomComponent={<p>{t('layout.footer.copyright')}</p>}
      />
    </>
  );
};
