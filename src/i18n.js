import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: [
      "en",
      "es",
      "fr",
      "de",
      "pt",
      "zh-CN",
      "ja",
      "ko",
      "ar",
      "hi",
      "it",
      "nl",
      "tr",
      "pl",
      "ru",
      "id",
      "vi",
      "th",
      "uk",
      "cs",
      "sv",
      "ro",
      "el",
      "da",
      "fi",
      "no",
      "he",
      "hu",
      "ms",
      "fa",
      "bn",
      "ta",
    ],
    backend: {
      loadPath: "/locales/{{lng}}/translation.json",
    },
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
