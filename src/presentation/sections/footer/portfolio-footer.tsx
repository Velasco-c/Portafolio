import styles from "./portfolio-footer.module.css";

export function PortfolioFooter({ name, legal }: { name: string; legal: string }) {
  return <footer className={styles.footer} aria-label="Pie de página">
    <p>{name}</p>
    <small>{legal}</small>
  </footer>;
}
