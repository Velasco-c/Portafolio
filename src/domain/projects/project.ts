import type { ExternalLink, ImageAsset } from "../common/models";

export interface StackItem {
  label: string;
  skillId?: string;
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  stack: readonly StackItem[];
  repository: ExternalLink;
  cover?: ImageAsset;
}
