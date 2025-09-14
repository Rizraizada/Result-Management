import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './index.module.css';

const Dropdiv = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState('');

  useEffect(() => {
    if (router.isReady) {
      const pathSegments = router.asPath.split('/').filter(segment => segment);
      const lastSegment = pathSegments[pathSegments.length - 1];

      // Format the last segment as the current page title
      const formattedTitle = lastSegment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      setCurrentPage(formattedTitle);
    }
  }, [router.isReady, router.asPath]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{currentPage}</h1>
      <nav className={styles.breadcrumb}>
        <a href="/">Home</a>
        <span className={styles.breadcrumbSeparator}> / </span>
        <span className={styles.breadcrumbCurrent}>{currentPage}</span>
      </nav>
    </div>
  );
};

export default Dropdiv;
