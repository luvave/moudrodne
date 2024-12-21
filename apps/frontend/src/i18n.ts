import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import cs from './translations/cs.json';

const resources = {
  cs: { translation: cs },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'cs',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
