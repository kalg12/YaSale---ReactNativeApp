import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { storage } from "../storage";
import { config } from "../config/env";
import es from "./es.json";
import en from "./en.json";

const initI18n = async () => {
  // Get saved language or use default
  const savedLanguage = await storage.getLanguage();
  const defaultLanguage = savedLanguage || config.DEFAULT_LANGUAGE;

  i18next.use(initReactI18next).init({
    lng: defaultLanguage,
    fallbackLng: "es",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      es: { translation: es },
      en: { translation: en },
    },
  });

  return i18next;
};

// Initialize immediately
initI18n().catch(console.error);

export default i18next;
