import path from 'node:path';

import { I18n } from 'i18n';

const i18n = new I18n();

i18n.configure({
  locales: ['en', 'vi'],
  directory: path.join(__dirname, '..', 'locales'),
  defaultLocale: 'vi',
});

export default i18n;
