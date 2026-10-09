import { getHomeContent } from "../application/use-cases/get-home-content";
import { StaticContentRepository } from "../infrastructure/content/static-content-repository";
import type { Locale } from "../i18n/config";

export function loadHomeContent(locale: Locale = "es") {
  return getHomeContent(new StaticContentRepository(locale));
}
