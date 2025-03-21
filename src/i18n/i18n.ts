import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import fr from "../locales/fr.json";
import { CHOSEN_LANGUAGE_KEY } from "./I18NPicker";

export const Languages = Object.freeze({
  en: "en",
  fr: "fr",
} as const);

export type Languages = (typeof Languages)[keyof typeof Languages];

const resources = {
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
};

i18n.use(initReactI18next).init({
  resources: resources,
  lng: localStorage.getItem(CHOSEN_LANGUAGE_KEY) ?? "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
