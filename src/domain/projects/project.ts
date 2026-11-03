import type { ExternalLink } from "../common/models";

interface StackItem {
  label: string;
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  stack: readonly StackItem[];
  repository: ExternalLink;
}
