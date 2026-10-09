export interface ExternalLink {
  label: string;
  href: string;
}

export interface ImageAsset {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  focalPoint?: { x: number; y: number };
}

export interface Period {
  start: string;
  end?: string;
}

export interface Location {
  city: string;
  country: string;
}
