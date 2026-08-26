import Section from './Section';
import { skills } from '../data/content';
import styles from './Skills.module.css';

export default function Skills() {
  return (
    <Section id="skills" index={3} heading={skills.heading}>
      <div className={styles.grid}>
        {skills.categories.map((category) => (
          <div key={category.name} className={styles.category}>
            <h3 className={styles.categoryName}>{category.name}</h3>
            <ul className={styles.items}>
              {category.items.map((item) => (
                <li key={item} className={styles.item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
