import type { Profile } from "../domain/profile/profile";
import { sitePath } from "../infrastructure/site-path";

export const profile = {
  nameLines: ["CARLOS", "ELIAS", "TZOY", "VELASCO"],
  fullName: "Carlos Elias Tzoy Velasco",
  title: "Técnico en Desarrollo de Software",
  location: { city: "Ciudad de Guatemala", country: "Guatemala" },
  availability: "Disponible para prácticas profesionales y oportunidades Junior",
  email: "carlos.velasco.est@gmail.com",
  links: {
    github: { label: "GitHub", href: "https://github.com/Velasco-c" },
    linkedin: { label: "LinkedIn", href: "https://www.linkedin.com/in/carlos-tzoy-velasco/" },
  },
  photo: {
    src: sitePath("/images/profile/carlos-placeholder.svg"),
    alt: "Placeholder de retrato para Carlos Elias Tzoy Velasco",
  },
} as const satisfies Profile;
