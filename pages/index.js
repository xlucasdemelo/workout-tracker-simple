import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import workoutData from '../data/gym_plan.json';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const navigateToDay = (day) => {
    router.push(`/day/${day}`);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingText}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Workout Tracker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Head>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Workout Tracker</h1>
          <p className={styles.subtitle}>Track your training progress</p>
        </div>
        
        <div>
          <h2 className={styles.sectionTitle}>Training Days</h2>
          
          {workoutData.map((dayData) => (
            <div 
              key={dayData.day} 
              className={styles.dayCard}
              onClick={() => navigateToDay(dayData.day)}
            >
              <div className={styles.dayCardContent}>
                <div>
                  <div className={styles.dayInfo}>
                    <div className={styles.dayBadge}>{dayData.day}</div>
                    <span className={styles.muscleGroup}>{dayData.muscleGroup}</span>
                  </div>
                  <p className={styles.exerciseCount}>
                    {dayData.exercises.length} exercise{dayData.exercises.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className={styles.arrow}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.statsCard}>
          <h2 className={styles.sectionTitle}>Statistics</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <p className={styles.statLabel}>Training Days</p>
              <p className={styles.statValue}>{workoutData.length}</p>
            </div>
            <div className={styles.statBox}>
              <p className={styles.statLabel}>Total Exercises</p>
              <p className={styles.statValue}>
                {workoutData.reduce((total, day) => total + day.exercises.length, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <footer className={styles.footer}>
          <p>© 2025 Workout Tracker App</p>
        </footer>
      </main>
    </div>
  );
}