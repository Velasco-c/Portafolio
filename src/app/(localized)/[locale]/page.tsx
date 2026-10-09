import { notFound } from "next/navigation";
import { loadHomeContent } from "../../composition";
import { getDictionary } from "../../../i18n/dictionaries";
import { isLocale } from "../../../i18n/config";
import { HomePage } from "../../../presentation/home-page";

export default async function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [content, messages] = await Promise.all([loadHomeContent(locale), Promise.resolve(getDictionary(locale))]);
  return <HomePage content={content} messages={messages} locale={locale} />;
}
