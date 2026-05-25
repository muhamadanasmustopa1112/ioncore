import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import idTranslation from "./locales/id.json";
import enTranslation from "./locales/en.json";

const resources = {
  id: {
    translation: idTranslation,
  },
  en: {
    translation: enTranslation,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "id",
    lng: "id",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
