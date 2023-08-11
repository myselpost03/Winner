import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "./Locales/en.json";
import translationES from "./Locales/es.json";
import translationAR from "./Locales/ar.json";
import translationFil from "./Locales/fil.json";
import translationFr from "./Locales/fr.json";
import translationHi from "./Locales/hi.json";
import translationId from "./Locales/id.json";
import translationJa from "./Locales/ja.json";
import translationKo from "./Locales/ko.json";
import translationPol from "./Locales/pol.json";
import translationPt from "./Locales/pt.json";
import translationRu from "./Locales/ru.json";
import translationTha from "./Locales/tha.json";
import translationTr from "./Locales/tr.json";
import translationUkr from "./Locales/ukr.json";
import translationVi from "./Locales/vi.json";
import translationZh from "./Locales/zh.json";
import translationDe from "./Locales/de.json";

const resources = {
  en: {
    translation: translationEN,
  },
  es: {
    translation: translationES,
  },
  ar: {
    translation: translationAR,
  },
  fil: {
    translation: translationFil,
  },
  fr: {
    translation: translationFr,
  },
  hi: {
    translation: translationHi,
  },
  id: {
    translation: translationId,
  },
  ja: {
    translation: translationJa,
  },
  ko: {
    translation: translationKo,
  },
  pol: {
    translation: translationPol,
  },
  pt: {
    translation: translationPt,
  },
  ru: {
    translation: translationRu,
  },
  tha: {
    translation: translationTha,
  },
  tr: {
    translation: translationTr,
  },
  ukr: {
    translation: translationUkr,
  },
  vi: {
    translation: translationVi,
  },
  zh: {
    translation: translationZh,
  },
  de: {
    translation: translationDe,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
