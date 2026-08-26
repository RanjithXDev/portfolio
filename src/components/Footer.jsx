import { footer } from '../data/content';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>{footer.text}</p>
      <p className={styles.note}>{footer.note}</p>
    </footer>
  );
}
