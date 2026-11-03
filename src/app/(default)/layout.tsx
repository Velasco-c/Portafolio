import type { ReactNode } from "react";
import { Document } from "../document";
import "../globals.css";

export default function DefaultLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <Document lang="es">{children}</Document>;
}
