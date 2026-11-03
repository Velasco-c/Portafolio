import type { Metadata } from "next";
import type { Locale } from "./config";
import { getDictionary } from "./dictionaries";
import { sitePath } from "../infrastructure/site-path";

export function getLocaleMetadata(locale: Locale): Metadata {
  const text = getDictionary(locale).metadata;
  return {
    title: text.title,
    description: text.description,
    alternates: {
      canonical: sitePath(`/${locale}`),
      languages: { es: sitePath("/es"), en: sitePath("/en") },
    },
  };
}
