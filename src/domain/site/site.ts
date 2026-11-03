export type SectionId = "hero" | "work" | "about" | "process" | "skills" | "learning" | "experience" | "contact";
export interface SectionPlanItem {
  id: SectionId;
  inNav: boolean;
}

export interface SiteCopy {
  nav: readonly string[];
  sections: Record<SectionId, string>;
  learningLabel: string;
  contactHeadline: string;
  contactCta: string;
  footerName: string;
  footerLegal: string;
}
