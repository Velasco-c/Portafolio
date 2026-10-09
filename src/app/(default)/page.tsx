import { loadHomeContent } from "../composition";
import { getDictionary } from "../../i18n/dictionaries";
import { HomePage } from "../../presentation/home-page";

export default async function RootPage() {
  const [content, messages] = await Promise.all([
    loadHomeContent("es"),
    Promise.resolve(getDictionary("es")),
  ]);
  return <HomePage content={content} messages={messages} locale="es" />;
}
