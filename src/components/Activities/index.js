import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import styles from './index.module.css';
import BASE_URL from '../config/apiConfig';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/activities/activities`);
        if (!response.ok) {
          throw new Error('Error fetching activities');
        }
        const data = await response.json();
        setActivities(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? activities.length - 2 : prevIndex - 2
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === activities.length - 2 ? 0 : prevIndex + 2
    );
  };

  return (
    <section className={styles.activitiesSection}>
      <div className={styles.container}>
        <header className={styles.carouselHeader}>
          <h3 className={styles.title}>Activities</h3>
        </header>
        <div className={styles.gridWrapper}>
          {activities.slice(currentIndex, currentIndex + 2).map((activity) => {
            const imageUrl = activity.image.startsWith('https')
              ? activity.image
              : `${BASE_URL}${activity.image}`;

            return (
              <div className={styles.gridItem} key={activity.id}>
                <img
                  src={imageUrl}
                  alt={activity.title}
                  className={styles.gridImage}
                />
                <div className={styles.overlay}>
                  <h3 className={styles.overlayTitle}>{activity.title}</h3>
                  <p className={styles.overlayDetails}>
                    {activity.date} by {activity.author}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.arrowsContainer}>
          <FaArrowLeft className={styles.arrowIcon} onClick={handlePrev} />
          <FaArrowRight className={styles.arrowIcon} onClick={handleNext} />
        </div>
      </div>
    </section>
  );
};

export default Activities;
