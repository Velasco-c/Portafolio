import type { ProcessStep } from "../../../domain/process/process-step";
import styles from "./process-steps.module.css";

export type ProcessStepLabel = Pick<ProcessStep, "key" | "label">;

export function ProcessSteps({ steps }: { steps: readonly ProcessStepLabel[] }) {
  return <ol className={styles.steps}>
    {steps.map(({ key, label }, index) => <li key={key}>
      {index === 0 ? <span className={styles.progressTrack} aria-hidden="true"><span data-process-progress /></span> : null}
      <h3>{label}</h3>
    </li>)}
  </ol>;
}
