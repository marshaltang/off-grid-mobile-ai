import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import zhCN from './locales/zh-CN.json';

export const resources = {
  en: { translation: en },
  'zh-CN': { translation: zhCN },
};

export const languageOptions = [
  { code: 'en', name: 'English' },
  { code: 'zh-CN', name: '中文 (简体)' },
];

i18n.use(initReactI18next).init({
  resources,
  lng: 'zh-CN',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
});

export default i18n;