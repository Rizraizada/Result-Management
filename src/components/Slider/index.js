import React, { useEffect, useState } from "react";
import styles from "./index.module.css"; // Ensure you have the correct styles imported
import BASE_URL from "@/components/config/apiConfig"; // Your base API URL for slider images

const Slider = () => {
  const [images, setImages] = useState([]); // Store fetched images in state

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/slider/sliders`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Ensure that the response data contains image paths and map them properly
        const updatedImages = data.map((image) => {
          // Assuming image contains a field `image` with the path
          return `${BASE_URL}${image.image}`; // Adjust based on actual API response
        });

        setImages(updatedImages);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  if (!images.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.slider}>
      <div className={styles.sliderWrapper}>
        {/* Dual panel effect */}
        <div className={styles.imageContainer}>
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

        {/* Welcome Message Overlay */}
        <div className={styles.welcomeMessage}>
          <h1>জ্ঞান ও আলোর রাজ্যে স্বাগতম</h1>
          <p>আপনার ভবিষ্যৎ গড়ার গল্প শুরু হোক আজই!</p>
        </div>

        {/* Slider Navigation */}
        <button className={styles.prev} onClick={handlePrev}>
          &#10094;
        </button>
        <button className={styles.next} onClick={handleNext}>
          &#10095;
        </button>

        {/* Dots for slider navigation */}
        <div className={styles.dots}>
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`${styles.dot} ${
                currentIndex === idx ? styles.active : ""
              }`}
              onClick={() => setCurrentIndex(idx)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
