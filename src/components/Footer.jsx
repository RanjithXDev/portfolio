import { useContentSlice } from '../content/ContentContext';
import styles from './Footer.module.css';

export default function Footer() {
  const footer = useContentSlice('footer');

  return (
    <footer className={styles.footer}>
      <p>{footer.text}</p>
      <p className={styles.note}>{footer.note}</p>
    </footer>
  );
}
