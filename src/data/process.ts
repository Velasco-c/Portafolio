import type { ProcessStep } from "../domain/process/process-step";

export const process = [
  { key: "analyze", label: "ANALYZE", description: "Entender requisitos, restricciones, usuarios y contexto técnico antes de implementar." },
  { key: "plan", label: "PLAN", description: "Definir estructura, responsabilidades, datos, dependencias y una estrategia de implementación." },
  { key: "build", label: "BUILD", description: "Construir la solución con componentes pequeños, convenciones claras y foco en mantenibilidad." },
  { key: "test", label: "TEST", description: "Verificar comportamiento, casos límite, accesibilidad y regresiones antes de entregar." },
  { key: "document", label: "DOCUMENT", description: "Dejar decisiones, configuración y uso documentados para facilitar continuidad y mantenimiento." },
  { key: "improve", label: "IMPROVE", description: "Medir, revisar y refinar rendimiento, UX, arquitectura y calidad de código de forma iterativa." },
] as const satisfies readonly ProcessStep[];
