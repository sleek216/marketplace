import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { english } from "./en";

const lazyLanguageLoaders = {
  es: () => import("./es").then((m) => m.spain),
  bn: () => import("./bn").then((m) => m.bengali),
  ar: () => import("./ar").then((m) => m.arabic),
};

const resources = {
  en: {
    translation: english,
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

/** Load non-English bundles on demand to shrink the initial JS payload. */
export async function loadLanguageBundle(languageCode) {
  const lng = languageCode || "en";
  if (lng === "en" || i18n.hasResourceBundle(lng, "translation")) {
    return lng;
  }

  const loader = lazyLanguageLoaders[lng];
  if (!loader) return lng;

  const translation = await loader();
  i18n.addResourceBundle(lng, "translation", translation, true, true);
  return lng;
}

export default i18n;
