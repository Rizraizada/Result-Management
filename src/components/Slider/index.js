import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import BASE_URL from "@/components/config/apiConfig";

const Slider = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState('slideLeft');

  // Array of different transition effects
  const transitions = ['slideLeft', 'slideRight', 'fadeZoom', 'slideUp', 'slideDown'];

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/slider/sliders`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const updatedImages = data.map((image) => `${BASE_URL}${image.image}`);
        setImages(updatedImages);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  // Auto-slide effect with random transitions
  useEffect(() => {
    if (images.length <= 1) return;
        
    const interval = setInterval(() => {
      const randomTransition = transitions[Math.floor(Math.random() * transitions.length)];
      handleTransition('next', randomTransition);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleTransition = (direction, transition = 'slideLeft') => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setTransitionType(transition);
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % images.length;
    } else if (direction === 'prev') {
      newIndex = (currentIndex - 1 + images.length) % images.length;
    } else {
      newIndex = direction; // Direct index from dot click
    }
    
    setNextIndex(newIndex);
    
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsTransitioning(false);
    }, 800);
  };

  const handleNext = () => {
    handleTransition('next', 'slideLeft');
  };

  const handlePrev = () => {
    handleTransition('prev', 'slideRight');
  };

  const handleDotClick = (idx) => {
    if (idx !== currentIndex && !isTransitioning) {
      const transition = idx > currentIndex ? 'slideLeft' : 'slideRight';
      handleTransition(idx, transition);
    }
  };

  if (!images.length) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.slider}>
      <div className={styles.sliderWrapper}>
        <div className={styles.imageContainer}>
          {/* Current Image */}
          <div 
            className={`${styles.imageSlide} ${styles.currentSlide} ${isTransitioning ? styles[`exit${transitionType.charAt(0).toUpperCase() + transitionType.slice(1)}`] : ''}`}
          >
            <img
              src={images[currentIndex]}
              alt={`slider ${currentIndex}`}
              className={`${styles.sliderImage} ${styles.leftPanel}`}
            />
            <img
              src={images[(currentIndex + 1) % images.length]}
              alt={`slider ${(currentIndex + 1) % images.length}`}
              className={`${styles.sliderImage} ${styles.rightPanel}`}
            />
          </div>

          {/* Next Image (only visible during transition) */}
          {isTransitioning && (
            <div 
              className={`${styles.imageSlide} ${styles.nextSlide} ${styles[`enter${transitionType.charAt(0).toUpperCase() + transitionType.slice(1)}`]}`}
            >
              <img
                src={images[nextIndex]}
                alt={`slider ${nextIndex}`}
                className={`${styles.sliderImage} ${styles.leftPanel}`}
              />
              <img
                src={images[(nextIndex + 1) % images.length]}
                alt={`slider ${(nextIndex + 1) % images.length}`}
                className={`${styles.sliderImage} ${styles.rightPanel}`}
              />
            </div>
          )}
        </div>

        <div className={`${styles.welcomeMessage} ${isTransitioning ? styles.messageTransition : ''}`}>
          <h1>জ্ঞান ও আলোর রাজ্যে স্বাগতম</h1>
          <p>আপনার ভবিষ্যৎ গড়ার গল্প শুরু হোক আজই!</p>
        </div>

        <button className={styles.prev} onClick={handlePrev} disabled={isTransitioning}>
          &#10094;
        </button>
        <button className={styles.next} onClick={handleNext} disabled={isTransitioning}>
          &#10095;
        </button>

        <div className={styles.dots}>
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`${styles.dot} ${
                currentIndex === idx ? styles.active : ""
              } ${isTransitioning ? styles.dotsTransition : ''}`}
              onClick={() => handleDotClick(idx)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
