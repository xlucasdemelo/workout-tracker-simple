import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../../styles/DayDetails.module.css';
import workoutData from '../../data/gym_plan.json';

export default function DayDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [dayData, setDayData] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseLoads, setExerciseLoads] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const foundDay = workoutData.find(day => day.day === id);
    
    if (foundDay) {
      setDayData(foundDay);
      
      // Initialize exercise loads
      const loadsObj = {};
      foundDay.exercises.forEach(exercise => {
        const seriesCount = parseInt(exercise.numberOfSeries.split('x')[0]);
        loadsObj[exercise.exercise] = Array(seriesCount).fill('');
      });
      setExerciseLoads(loadsObj);
    }
    
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [id]);

  const handleExerciseSelect = (exercise) => {
    setSelectedExercise(selectedExercise === exercise ? null : exercise);
  };

  const handleLoadChange = (exerciseName, seriesIndex, value) => {
    setExerciseLoads(prev => {
      const newLoads = {...prev};
      newLoads[exerciseName][seriesIndex] = value;
      return newLoads;
    });
  };

  const getSeriesCount = (numberOfSeries) => {
    if (!numberOfSeries) return 0;
    return parseInt(numberOfSeries.split('x')[0]);
  };

  const handleSave = (exerciseName) => {
    console.log('Saved loads for', exerciseName, ':', exerciseLoads[exerciseName]);
    // Here you would typically save the data to a backend
    alert(`Loads saved for ${exerciseName}`);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingText}>Loading...</div>
      </div>
    );
  }

  if (!dayData) {
    return (
      <div className={styles.error}>
        <h1 className={styles.errorTitle}>Day not found</h1>
        <Link href="/" className={styles.homeButton}>
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Day {dayData.day} - {dayData.muscleGroup} - Workout Tracker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Head>

      <div className={styles.content}>
        <div className={styles.header}>
          <Link href="/" passHref>
            <button className={styles.backButton}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </Link>
          <h1 className={styles.title}>
            Day {dayData.day} - {dayData.muscleGroup}
          </h1>
        </div>
        
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Exercises</h2>
          </div>
          
          <ul className={styles.exerciseList}>
            {dayData.exercises.map((exercise) => (
              <li key={exercise.exercise} className={styles.exerciseItem}>
                <button 
                  className={styles.exerciseButton}
                  onClick={() => handleExerciseSelect(exercise.exercise)}
                >
                  <div>
                    <p className={styles.exerciseName}>{exercise.exercise}</p>
                    <div className={styles.exerciseDetails}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailIcon}>S</span>
                        Series: {exercise.numberOfSeries}
                      </div>
                      
                      {exercise.rest && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailIcon}>R</span>
                          Rest: {exercise.rest}
                        </div>
                      )}
                      
                      {exercise.cadence && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailIcon}>C</span>
                          Cadence: {exercise.cadence}
                        </div>
                      )}
                      
                      {exercise.method && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailIcon}>M</span>
                          Method: {exercise.method}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={styles.toggleIcon}>
                    {selectedExercise === exercise.exercise ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
                
                {selectedExercise === exercise.exercise && (
                  <div className={styles.exerciseInputs}>
                    <p className={styles.inputLabel}>Track your weight for each series:</p>
                    <div className={styles.inputsContainer}>
                      {Array.from({ length: getSeriesCount(exercise.numberOfSeries) }).map((_, index) => (
                        <div key={index} className={styles.inputRow}>
                          <span className={styles.seriesLabel}>Series {index + 1}:</span>
                          <div className={styles.loadInput}>
                            <input
                              type="text"
                              value={exerciseLoads[exercise.exercise]?.[index] || ''}
                              onChange={(e) => handleLoadChange(exercise.exercise, index, e.target.value)}
                              className={styles.inputField}
                              placeholder="Enter weight"
                            />
                            <span className={styles.inputUnit}>kg</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button 
                      className={styles.saveButton}
                      onClick={() => handleSave(exercise.exercise)}
                    >
                      Save
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}