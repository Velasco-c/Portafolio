import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Document } from "../../document";
import { isLocale, locales } from "../../../i18n/config";
import { getLocaleMetadata } from "../../../i18n/metadata";
import "../../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  return getLocaleMetadata(value);
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <Document lang={locale}>{children}</Document>;
}
