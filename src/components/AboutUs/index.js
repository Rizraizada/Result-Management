import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaBook, FaLightbulb } from 'react-icons/fa';
import styles from './index.module.css';

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState('মূল্যবোধ');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'মূল্যবোধ':
        return (
          <div className={styles.valueGrid}>
            {[
              { icon: '🎯', title: 'শিক্ষাগত শ্রেষ্ঠত্ব', desc: 'শিক্ষার্থীদের মেধার বিকাশ ও মানসম্মত শিক্ষা প্রদানে প্রতিশ্রুতিবদ্ধ।' },
              { icon: '🤝', title: 'চরিত্র গঠন', desc: 'নৈতিক মূল্যবোধ ও নীতিমালা গড়ে তোলা যা দায়িত্বশীল নাগরিক তৈরিতে সহায়ক।' },
              { icon: '🌟', title: 'উদ্ভাবন', desc: 'আধুনিক শিক্ষার পদ্ধতি গ্রহণ করলেও ঐতিহ্যবাহী মূল্যবোধ বজায় রাখা।' },
            ].map((item, index) => (
              <div className={styles.valueCard} key={index}>
                <div className={styles.valueIcon}>{item.icon}</div>
                <h3>{`${index + 1}. ${item.title}`}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        );
      case 'মিশন':
        return (
          <div className={styles.missionContent}>
            <div className={styles.missionImage}>
              <img src="/mison.png" alt="বিদ্যালয়ের মিশন" />
            </div>
            <div className={styles.missionText}>
              <h3>ভবিষ্যৎ নেতাদের গড়ে তোলা</h3>
              <p>আমাদের মিশন হলো:</p>
              <ul>
                {[
                  'সবার জন্য মানসম্মত শিক্ষা প্রদান',
                  'সমালোচনামূলক চিন্তা ও সৃজনশীলতা বৃদ্ধি',
                  'চরিত্র ও নেতৃত্ব দক্ষতা গড়ে তোলা',
                  'সংস্কৃতির মূল্যবোধ ও ঐতিহ্য প্রচার',
                  'সহানুভূতিশীল শিক্ষার পরিবেশ তৈরি',
                ].map((item, index) => (
                  <li key={index}>{`${index + 1}. ${item}`}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 'সম্পর্কে':
        return (
          <div className={styles.infoContent}>
            <div className={styles.info}>
              <img src="/school-building-facade-free-vector-300x300-1.jpg" alt="আমাদের সম্পর্কে" />
            </div>
            <div className={styles.infoText}>
              <p>আমাদের মিশন হলো:</p>
              <ul>
                {[
                  'ভবন এবং কক্ষ',
                  'আইসিটি ল্যাব',
                  'বিজ্ঞান ল্যাব',
                  'গ্রন্থাগার',
                  
                ].map((item, index) => (
                  <li key={index}>{`${index + 1}. ${item}`}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 'লক্ষ্য':
        return (
          <div className={styles.visionContent}>
            <div className={styles.visionStats}>
              {[
                { number: '১৯৬০', label: 'প্রতিষ্ঠিত' },
                { number: '১০০০+', label: 'শিক্ষার্থী' },
                { number: '১৫+', label: 'শিক্ষক' },
                { number: '৯০%', label: 'সাফল্যের হার' },
              ].map((stat, index) => (
                <div className={styles.statCard} key={index}>
                  <span className={styles.statNumber}>{stat.number}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
            <p className={styles.visionText}>
              আমাদের লক্ষ্য হলো শিক্ষা ক্ষেত্রে শ্রেষ্ঠত্ব অর্জন, যাতে আমাদের শিক্ষার্থীরা ভবিষ্যতে সফল ও দায়িত্বশীল নাগরিক হতে পারে।
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`${styles.container} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.headerSection}>
        <h1 className={styles.subtitle}>
          <br />
          শিক্ষা আমাদের পথচলা, সমাজ আমাদের লক্ষ্য।
        </h1>
        <p className={styles.tagline}>আগামীর নেতা তৈরি করছি আজ</p>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.leftSection}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'সম্পর্কে' ? styles.active : ''}`}
              onClick={() => handleTabClick('সম্পর্কে')}
            >
              <FaBook className={styles.icon} /> সম্পর্কে
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'মূল্যবোধ' ? styles.active : ''}`}
              onClick={() => handleTabClick('মূল্যবোধ')}
            >
              <FaGraduationCap className={styles.icon} /> আমাদের মূল্যবোধ
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'মিশন' ? styles.active : ''}`}
              onClick={() => handleTabClick('মিশন')}
            >
              <FaBook className={styles.icon} /> মিশন
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'লক্ষ্য' ? styles.active : ''}`}
              onClick={() => handleTabClick('লক্ষ্য')}
            >
              <FaLightbulb className={styles.icon} /> লক্ষ্য
            </button>
          </div>

          <div className={`${styles.content} ${styles.fadeIn}`}>
            {renderTabContent()}
          </div>
        </div>

        <div className={styles.schoolInfo}>
          <div className={`${styles.principalSection} ${styles.headmasterSection}`}>
            <img 
              src="/uploads/WhatsApp Image 2025-06-18 at 10.28.20 PM (1).jpeg" 
              alt="প্রধান শিক্ষক" 
              className={styles.principalPhoto} 
            />
            <h3 className={styles.subtitleHeading}>মো. মনিরুল ইসলাম</h3>
            <p className={styles.designation}>প্রধান শিক্ষক</p>
            <p className={styles.principalMessage}>
              "শিক্ষা মানেই কেবল শ্রেষ্ঠত্ব নয়, এটি একজন পরিপূর্ণ মানুষ তৈরি করার প্রক্রিয়া।"
            </p>
          </div>
          <div className={`${styles.principalSection} ${styles.assistantHeadmasterSection}`}>
            <img 
              src="/uploads/4f8d0f86-19a1-4c4a-aef8-35a4120ab45f.jpg" 
              alt="সহকারী প্রধান শিক্ষক" 
              className={styles.principalPhoto} 
            />
            <h3 className={styles.subtitleHeading}>এম.ডি. কবির আহমেদ
            </h3>
            <p className={styles.designation}>সহকারী প্রধান শিক্ষক</p>
            <p className={styles.principalMessage}>
              "শিক্ষা হলো সেই আলো যা অন্ধকারকে ভেদ করে নতুন পথ দেখায়।"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
