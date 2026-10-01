import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import pt from "./pt.json";
import en from "./en.json";
import es from "./es.json";

export const LANGS = [
  { code: "pt", flag: "🇧🇷", label: "Português", speech: "pt-BR" },
  { code: "en", flag: "🇬🇧", label: "English", speech: "en-GB" },
  { code: "es", flag: "🇪🇸", label: "Español", speech: "es-ES" },
] as const;
export type Lang = (typeof LANGS)[number]["code"];
export const LANG_KEY = "driverpulse:lang";

export function speechLang(code: string) {
  return LANGS.find((l) => l.code === code)?.speech ?? "pt-BR";
}

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources: { pt: { translation: pt }, en: { translation: en }, es: { translation: es } },
    lng: "pt",
    fallbackLng: "pt",
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

export default i18n;
