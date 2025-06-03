//'@/app/page.tsx
import Image from "next/image";
import styles from "./page.module.css";
import LandingPage from '@/app/components/landing';

export default function Home() {
  return (
    <div className={styles.main}>
      <LandingPage />
    </div>
  );
}
