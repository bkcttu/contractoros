import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '@/locales/en.json'
import es from '@/locales/es.json'

const savedLang = localStorage.getItem('contractoros-lang') || 'en'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

export function setLanguage(lang: 'en' | 'es') {
  i18n.changeLanguage(lang)
  localStorage.setItem('contractoros-lang', lang)
}

export function getLanguage(): string {
  return i18n.language || 'en'
}

export default i18n
