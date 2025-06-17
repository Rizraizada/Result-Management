import React, { useState, useEffect } from 'react';
import Dropdiv from "@/components/Dropdiv";
import BASE_URL from '@/components/config/apiConfig';

const GalleryView = () => {
  const [images, setImages] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const imagesPerPage = 6; // Number of images per page

  const fetchImages = async () => {
    const categoryParam = activeFilter === 'All' ? '' : `?category=${activeFilter}`;
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/gallery${categoryParam}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [activeFilter]);

  const categories = ['All', 'Meeting', 'Team', 'Tour', 'National Day'];

  const filteredImages = activeFilter === 'All' ? images : images.filter(img => img.category === activeFilter);
  
  // Calculate the current images to display based on pagination
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = filteredImages.slice(indexOfFirstImage, indexOfLastImage);

  const totalPages = Math.ceil(filteredImages.length / imagesPerPage);

  return (
    <div style={styles.container}>
      <Dropdiv />

      <div style={styles.wrapper}>
        {/* Header Section */}
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>Explore Our Work</h2>
          <p style={styles.headerText}>
            A curated selection of images showcasing our team’s efforts and memorable moments.
          </p>
        </div>

        {/* Filter Buttons */}
        <div style={styles.filterWrapper}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              style={{
                ...styles.filterButton,
                ...(activeFilter === category ? styles.activeFilter : styles.inactiveFilter)
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div style={styles.grid}>
          {loading ? (
            <p>Loading images...</p>
          ) : (
            currentImages.map((image) => (
              <div key={image.id} style={styles.imageContainer}>
                <img
                  src={`${BASE_URL}${image.image}`}
                  alt={image.alt || 'Gallery Image'}
                  style={styles.image}
                />
                <div style={styles.imageOverlay}>
                  <p style={styles.imageCategory}>{image.category}</p>
                  <p style={styles.imageAlt}>{image.alt}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        <div style={styles.pagination}>
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1}
            style={styles.pageButton}
          >
            Previous
          </button>
          <span>{currentPage} / {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={currentPage === totalPages}
            style={styles.pageButton}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default GalleryView;

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily: "'Roboto', sans-serif",
  },
  wrapper: {
    maxWidth: '1140px',
    margin: '0 auto',
    padding: '0 15px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  headerTitle: {
    fontSize: '40px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '16px',
  },
  headerText: {
    fontSize: '18px',
    color: '#6b7280',
  },
  filterWrapper: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '40px',
  },
  filterButton: {
    padding: '12px 24px',
    borderRadius: '20px',
    fontWeight: '600',
    transition: 'all 0.2s ease-in-out',
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
    fontSize: '14px',
  },
  activeFilter: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
  inactiveFilter: {
    backgroundColor: '#ffffff',
    color: '#4b5563',
    border: '1px solid #e5e7eb',
    hover: {
      backgroundColor: '#f3f4f6',
    }
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    justifyContent: 'center',
  },
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '12px',
    boxShadow: '0px 6px 14px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)', // Add hover scale effect
    },
  },
  image: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    transition: 'transform 0.3s ease-in-out',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '10px',
    background: 'linear-gradient(0deg, rgba(0,0,0,0.7), rgba(0,0,0,0))',
    color: '#ffffff',
    opacity: 0.8,
    transition: 'opacity 0.3s ease-in-out',
  },
  imageCategory: {
    fontWeight: '700',
    fontSize: '16px',
  },
  imageAlt: {
    fontSize: '12px',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
  },
  pageButton: {
    padding: '10px 20px',
    margin: '0 10px',
    borderRadius: '5px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  }
};
