import { useState, useEffect } from 'react';
import styles from './index.module.css';
import BASE_URL from '../config/apiConfig';

export default function GallerySection() {
  const [Gallery, setGallery] = useState([]);
  
  useEffect(() => {
    async function fetchGallery() {
      try {
        const response = await fetch(`${BASE_URL}/api/Gallery`);
        const data = await response.json();
        setGallery(data);
      } catch (error) {
        console.error('Error fetching Gallery:', error);
      }
    }
    fetchGallery();
  }, []);
  
  const featuredGallery = Gallery.slice(0, 1);
  const otherGallery = Gallery.slice(1);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.subtitle}>Latest Updates</h2>
        <h1 className={styles.title}>Gallery & Highlights</h1>
        <div className={styles.titleUnderline}></div>
      </header>

      <div className={styles.GalleryGrid}>
        {/* Featured Gallery */}
        <section className={`${styles.featuredGallery} ${styles.fadeIn}`}>
          {featuredGallery.map((item) => (
            <div key={item.id} className={styles.featuredGalleryItem}>
              <div className={styles.featuredImageContainer}>
                <img src={item.image} alt={item.title} className={styles.featuredImage} />
                <span className={styles.featuredBadge}>Featured</span>
              </div>
              <div className={styles.featuredContent}>
                <h3 className={styles.featuredTitle}>{item.title}</h3>
                {/* Render the raw HTML from database */}
                <p className={styles.featuredDescription} dangerouslySetInnerHTML={{ __html: item.description }}></p>
              </div>
            </div>
          ))}
        </section>

        {/* Other Gallery Items */}
        <aside className={styles.GalleryList}>
          {otherGallery.map((item, index) => (
            <div key={item.id} className={`${styles.GalleryItem} ${styles.slideIn}`}>
              <div className={`${styles.GalleryIcon} ${styles[`icon-${index % 3}`]}`}></div>
              <div className={styles.GalleryImageContainer}>
                <img src={item.image} alt={item.title} className={styles.GalleryImage} />
              </div>
              <div className={styles.GalleryContent}>
                <h3 className={styles.GalleryTitle}>{item.title}</h3>
                {/* Render raw HTML for description */}
                <p className={styles.GalleryDescription} dangerouslySetInnerHTML={{ __html: item.description }}></p>
                {item.category && <p><strong>Category:</strong> {item.category}</p>}
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
