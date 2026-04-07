import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>Embr Roasting Co.</span>
          <p className={styles.tagline}>Small batch, big flavor.</p>
        </div>
        <div className={styles.links}>
          <a href="#menu">Menu</a>
          <a href="#about">About</a>
          <a href="#subscribe">Subscribe</a>
          <a href="#faq">FAQ</a>
        </div>
        <p className={styles.copy}>
          &copy; {new Date().getFullYear()} Embr Roasting Co.
        </p>
      </div>
    </footer>
  );
}
