import { CoffeeBag } from './illustrations/CoffeeBag';
import { CoffeeCup } from './illustrations/CoffeeCup';
import { CoffeeBowl } from './illustrations/CoffeeBowl';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.left}>
        <div className={styles.logo}>Embr Roasting Co.</div>
        <h1 className={styles.headline}>
          Coffee that<br />
          actually tastes<br />
          like the bag smells.
        </h1>
        <div className={styles.cta}>
          <a href="#menu" className={styles.pill}>
            Explore our menu
          </a>
        </div>
      </div>
      <div className={styles.right}>
        <div className={`${styles.illustration} ${styles.bag}`}>
          <CoffeeBag />
        </div>
        <div className={`${styles.illustration} ${styles.cup}`}>
          <CoffeeCup />
        </div>
        <div className={`${styles.illustration} ${styles.bowl}`}>
          <CoffeeBowl />
        </div>
      </div>
    </section>
  );
}
