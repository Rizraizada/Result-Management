import React, { useState, useEffect } from 'react';
import styles from './index.module.css';

const Footer = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* <div className={styles.waveDivider}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div> */}
      <div className={styles.content}>
        <div className={styles.logoSection}>
          <h2 className={styles.schoolName}>ভারাসার উচ্চ বিদ্যালয়</h2>
          <p className={styles.slogan}>
            মন গড়ে, ভবিষ্যত নির্মাণ<br />
            শিক্ষা ক্ষেত্রে শ্রেষ্ঠত্ব [প্রতিষ্ঠার বছর] থেকে
          </p>
          <div className={styles.socialLinks}>
            <a href="#" aria-label="Facebook">📱</a>
          </div>
        </div>
        <div className={styles.quickLinks}>
          <h3>দ্রুত লিঙ্ক</h3>
          <ul>
            <li><a href="/notice">নোটিশ</a></li>
            <li><a href="/gallery">গ্যালারি</a></li>
            <li><a href="/contact">যোগাযোগ</a></li>
          </ul>
        </div>
        <div className={styles.officialInfo}>
          <h3>যোগাযোগ করুন</h3>
          <p>
            <span className={styles.icon}>📍</span> ভরাসার, বুড়িচং, কুমিল্লা<br />
            <br />
            <span className={styles.icon}>📞</span> bharasarhs1926@gmail.com
          </p>
       
        </div>
      </div>
      <div className={styles.copyright}>
        <p>© {currentYear} ভারাসার উচ্চ বিদ্যালয়। সর্বস্বত্ব সংরক্ষিত।</p>
        <p className={styles.motto}>"জ্ঞানই শক্তি"</p>
      </div>
      {showScroll && (
        <button className={styles.scrollTopButton} onClick={scrollToTop}>
          ↑
        </button>
      )}
    </footer>
  );
};

export default Footer;
