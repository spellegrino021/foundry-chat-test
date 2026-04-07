import coffeeBag from './illustrations/coffeewithoutbg.png';
import coffeeCup from './illustrations/fullmug.jpg';
import coffeeBowl from './illustrations/emptymug.jpg';
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
          <img src={coffeeBag} alt="Coffee bag" className={styles.img} />
        </div>
        <div className={`${styles.illustration} ${styles.cup}`}>
          <img src={coffeeCup} alt="Full coffee mug" className={styles.img} />
        </div>
        <div className={`${styles.illustration} ${styles.bowl}`}>
          <img src={coffeeBowl} alt="Empty coffee mug" className={styles.img} />
        </div>
      </div>
    </section>
  );
}
