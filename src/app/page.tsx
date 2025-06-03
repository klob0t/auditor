//'@/app/page.tsx
import styles from "./page.module.css";
import LandingPage from '@/app/components/landing';

export default function Home() {
  return (
    <div className={styles.main}>
      <LandingPage />
    </div>
  );
}
