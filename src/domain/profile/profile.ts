import type { ExternalLink, ImageAsset, Location } from "../common/models";

export interface Profile {
  nameLines: readonly [string, string, string, string];
  fullName: string;
  title: string;
  location: Location;
  availability: string;
  email: string;
  links: { github: ExternalLink; linkedin: ExternalLink };
  photo: ImageAsset;
}
