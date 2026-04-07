import allCoffee from './illustrations/alltogether.jpg';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.logoWrap}>
        <span className={styles.logoOutline}>Embr Roasting Co</span>
        <span className={styles.logo}>Embr Roasting Co</span>
      </div>
      <div className={styles.content}>
        <div className={styles.left}>
          <h1 className={styles.headline}>
            Coffee that<br />
            actually tastes<br />
            like the bag smells.
          </h1>
          <div className={styles.cta}>
            <a href="#menu" className={styles.pill}>
              Explore our roasts
            </a>
          </div>
        </div>
        <div className={styles.right}>
          <img src={allCoffee} alt="Coffee bag, mug, and bowl" className={styles.img} />
        </div>
      </div>
    </section>
  );
}
