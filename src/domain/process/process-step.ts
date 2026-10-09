export interface ProcessStep {
  key: "analyze" | "plan" | "build" | "test" | "document" | "improve";
  label: string;
  description: string;
}
