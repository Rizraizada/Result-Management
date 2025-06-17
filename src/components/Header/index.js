import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  FaHome,
  FaUsers,
  FaAward,
  FaInfoCircle,
  FaNewspaper,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaBook,
  FaPhone,
  FaCalendarAlt,
} from "react-icons/fa";
import styles from "./index.module.css";
import Link from "next/link";
import BASE_URL from "../config/apiConfig";

const Header = () => {
  const router = useRouter();
  const [activeDropdowns, setActiveDropdowns] = useState({});
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [notices, setNotices] = useState([]);
  const [latestNotice, setLatestNotice] = useState("");

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/notices`);
        const data = await res.json();
        const sortedData = data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setNotices(sortedData);
        if (sortedData.length > 0) {
          const content = sortedData[0].content;
          const first20Words = content.split(/\s+/).slice(0, 20).join(" ");
          setLatestNotice(first20Words + "...");
        }
      } catch (err) {
        console.error("Error fetching notices:", err);
      }
    };
    fetchNotices();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSideMenuOpen(false);
        setActiveDropdowns({});
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = (href) => router.pathname === href;

  const dropdownContent = {
    home: [
      { label: "প্রধান শিক্ষকের বার্তা", href: "/home/principal-message" },
      { label: "সহকারী প্রধান শিক্ষকের বার্তা", href: "/home/assistant-head-message" },
      { label: "চেয়ারম্যানের বার্তা", href: "/home/chairman-message" },
      { label: "লগইন", href: "/login" },
    ],
    teachersandstaff: [
      { label: "শিক্ষকগণ", href: "/teachersandstaff/teachers" },
      { label: "কর্মচারীবৃন্দ", href: "/teachersandstaff/staff" },
    ],
    committeemembers: [
      { label: "কমিটির সদস্যবৃন্দ", href: "/committee-members" },
      { label: "পূর্বতন কমিটি", href: "/committee-members/previous" },
    ],
    academic: [
      { label: "শ্রেণি রুটিন", href: "/academic/class-routine" },
      { label: "পরীক্ষা রুটিন", href: "/academic/exam-routine" },
      { label: "সিলেবাস", href: "/academic/syllabus" },
    ],
    notice: [
      { label: "ফলাফল", href: "/notice/results" },
      { label: "ভর্তি তথ্য", href: "/notice/admission" },
      { label: "সকল নোটিশ", href: "/notice/all" },
    ],
    contact: [
      { label: "যোগাযোগ করুন", href: "/contact" },
      { label: "মানচিত্র", href: "/contact/map" },
    ],
  };

  const toggleSideMenu = () => {
    setIsSideMenuOpen((prev) => !prev);
    setActiveDropdowns({});
  };

  const toggleDropdown = (label) => {
    const normalizedLabel = label.toLowerCase().replace(/\s+/g, "");
    setActiveDropdowns((prev) => ({
      ...Object.fromEntries(Object.keys(prev).map((key) => [key, false])),
      [normalizedLabel]: !prev[normalizedLabel],
    }));
  };

  const NavItem = ({ href, icon: Icon, label }) => {
    const normalizedLabel = label.toLowerCase().replace(/\s+/g, "");
    const isDropdownActive = activeDropdowns[normalizedLabel];

    return (
      <div className={styles.navItemContainer}>
        <Link
          href={href}
          className={`${styles.navItem} ${isActive(href) ? styles.active : ""}`}
          onClick={() =>
            isMobile &&
            dropdownContent[normalizedLabel] &&
            toggleDropdown(label)
          }
        >
          <Icon size={18} />
          <span>{label}</span>

          {dropdownContent[normalizedLabel] && (
            <span className={styles.dropdownToggle}>
              {isDropdownActive ? (
                <FaChevronUp size={14} />
              ) : (
                <FaChevronDown size={14} />
              )}
            </span>
          )}
        </Link>

        {dropdownContent[normalizedLabel] && (
          <div
            className={`${styles.dropdown} ${
              isMobile && isDropdownActive ? styles.mobileDropdown : ""
            } ${!isMobile ? styles.desktopDropdown : ""}`}
          >
            {dropdownContent[normalizedLabel].map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={styles.dropdownItem}
                onClick={() => isMobile && setIsSideMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <header className={styles.header}>
      <div className={styles.topStrip}>
        <div className={styles.topStripContent}>
          <div className={styles.topStripLeft}>
            <div className={styles.contactInfo}>
              <FaPhone size={12} />
              <span>+৮৮০১৭১২-৩৪৫৬৭৮</span>
            </div>
            <div className={styles.contactInfo}>
              <FaCalendarAlt size={12} />
              <span>প্রতিষ্ঠাকাল: ১৯৬৫</span>
            </div>
          </div>
          <div className={styles.topStripRight}>
            <Link href="/login" className={styles.loginBtn}>লগইন</Link>
           </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.topHeader}>
          <div className={styles.logoContainer}>
            <div className={styles.logoWrapper}>
              <img
                src="/bhs-logo.png"
                alt="School Logo"
                className={styles.logoImage}
              />
            </div>
            <div className={styles.schoolInfo}>
              <h1 className={styles.schoolNameBn}>ভরাসার বহুমুখী উচ্চ বিদ্যালয়</h1>
              <p className={styles.schoolMotto}>শিক্ষাই জাতির মেরুদণ্ড</p>
              <div className={styles.eiin}>EIIN: 105256 | স্থাপিত: ১৯৬৫</div>
            </div>
          </div>
        </div>

        {isMobile && (
          <button className={styles.menuToggle} onClick={toggleSideMenu}>
            {isSideMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        )}

        <nav className={`${styles.nav} ${isSideMenuOpen ? styles.open : ""}`}>
          {isMobile && (
            <div className={styles.mobileNav}>
              <div className={styles.mobileSidebarLogo}>
                <img src="/bhs-logo.png" alt="School Logo" />
              </div>
              <button className={styles.closeMenuBtn} onClick={toggleSideMenu}>
                <FaTimes size={24} />
              </button>
            </div>
          )}

          <NavItem href="/" icon={FaHome} label="হোম" />
            <NavItem href="/gallery" icon={FaAward} label="গ্যালারি" />
           <NavItem href="/contact" icon={FaInfoCircle} label="যোগাযোগ" />
        </nav>

        <div className={styles.noticeBar}>
          <div className={styles.noticeLabel}>জরুরি নোটিশ</div>
          <div className={styles.noticeContent}>
            <div className={styles.marquee}>
              {latestNotice ? (
                <span>{latestNotice}</span>
              ) : (
                "সর্বশেষ নোটিশ লোড হচ্ছে..."
              )}
            </div>
          </div>
          <Link href="/notice/all" className={styles.viewAllNotices}>
            সবগুলো দেখুন
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;