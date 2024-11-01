import { createServerFn } from '@tanstack/start';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getHeader } from 'vinxi/http';
import { z } from 'zod';
import { zodI18nMap } from 'zod-i18n-map';

import en from '@/locales/en/translation.json';
import fr from '@/locales/fr/translation.json';

const resources = {
  en: { translation: en },
  fr: { translation: fr },
} as const;

type SupportedLocale = keyof typeof resources;

const supportedLocales = Object.keys(resources) as SupportedLocale[];

type Locale = (typeof supportedLocales)[number];
const defaultLocale: Locale = 'en';

// "extract": "i18next --config i18next-parser.config.ts"

const getClientLocale = (): string => {
  if (import.meta.env.SSR) return defaultLocale;
  const userLanguage =
    'userLanguage' in navigator ? navigator.userLanguage : null;

  return navigator.language || (userLanguage as string);
};

const getLocale = createServerFn('GET', async () => {
  const header = getHeader('Accept-Language');
  const languages = header?.split(',') ?? [];

  return (
    supportedLocales.find((lang) => languages.includes(lang)) ?? defaultLocale
  );
});

i18n.use(initReactI18next).init({
  fallbackLng: defaultLocale,
  supportedLngs: supportedLocales,
  debug: import.meta.env.DEV,
  lng: getClientLocale(),

  saveMissing: true,
  saveMissingTo: 'current',
  resources,
});

z.setErrorMap(zodI18nMap);

export { getLocale, supportedLocales };
export default i18n;
