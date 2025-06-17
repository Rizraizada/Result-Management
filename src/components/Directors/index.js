import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import BASE_URL from "../config/apiConfig";

const Directors = () => {
  const [directors, setDirectors] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchDirectors = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/director`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setDirectors(data); // Save the data to the state
      } catch (error) {
        console.error("Error fetching directors:", error);
      }
    };

    fetchDirectors();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className={styles.directorsSection}>
      <div className={styles.container}>
        {/* Header Section */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            আমাদের সম্মানিত কমিটি সদস্যদের পরিচিতি
          </h1>
          <p className={styles.description}>
            কর্মচারীদের অবশ্যই বুঝতে হবে যে নতুন চাকরি বা বিদ্যমান চাকরিতে
            প্রবেশ করার সময় তাদের সহকর্মীদের সাথে ভালোভাবে কাজ করা কতটা
            গুরুত্বপূর্ণ। একটি দলগত খেলোয়াড় আরও মূল্যবান।
          </p>
        </div>

        {/* Directors Grid */}
        <div className={styles.directorsGrid}>
          {directors.map((director) => (
            <div key={director.id} className={styles.directorCard}>
              {/* Blue Top Border */}
              <div className={styles.topBorder}></div>

              {/* Image Container */}
              <div className={styles.imageContainer}>
                <img
                  src={`${BASE_URL}${director.image_url}`}
                  alt={director.name}
                  className={styles.directorImage}
                />
              </div>

              {/* Content Container */}
              <div className={styles.contentContainer}>
                <h3 className={styles.directorName}>{director.name}</h3>
                <p className={styles.directorTitle}>{director.position}</p>
                <div
                  className={`${styles.directorDescription} ${
                    expandedId === director.id
                      ? styles.expanded
                      : styles.collapsed
                  }`}
                >
                  <p className={styles.directorDetails}>{director.details}</p>
                </div>
                {(!expandedId || expandedId !== director.id) && (
                  <button
                    onClick={() => toggleExpand(director.id)}
                    className={styles.readMoreBtn}
                  >
                    Read more...
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Directors;
