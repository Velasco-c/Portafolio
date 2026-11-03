import type { ReactNode } from "react";
import Script from "next/script";

import { themeInitScript } from "../design-system/theme/init-script";

export function Document({
  children,
  lang,
}: {
  children: ReactNode;
  lang: "es" | "en";
}) {
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
