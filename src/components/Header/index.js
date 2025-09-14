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
} from "react-icons/fa";
import styles from "./index.module.css";
import Link from "next/link";
import BASE_URL from "../config/apiConfig";

const Header = () => {
  const router = useRouter();
  const [activeDropdowns, setActiveDropdowns] = useState({});
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [notices, setNotices] = useState([]); // State to hold notices
  const [latestNotice, setLatestNotice] = useState(""); // State to hold the latest notice content

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
          // Get the first 20 words of the latest notice content
          const content = sortedData[0].content;
          const first20Words = content.split(/\s+/).slice(0, 20).join(" ");
          setLatestNotice(first20Words); // Set the truncated content
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
    ],
    committeemembers: [
      { label: "কমিটির সদস্যবৃন্দ", href: "/committee-members" },
    ],
    contact: [{ label: "যোগাযোগ", href: "/contact" }],
    contact: [{ label: "লগইন", href: "/login" }],
    notice: [
      { label: "ফলাফল ও নোটিশ", href: "/notice/results" },
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
          <Icon size={20} />
          <span>{label}</span>

          {dropdownContent[normalizedLabel] && isMobile && (
            <button
              className={styles.dropdownToggle}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleDropdown(label);
              }}
            >
              {isDropdownActive ? (
                <FaChevronUp size={16} />
              ) : (
                <FaChevronDown size={16} />
              )}
            </button>
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
      <div className={styles.content}>
        <div className={styles.topHeader}>
          <div className={styles.logoContainer}>
            <img
              src="/bhs-logo.png"
              alt="School Logo"
              className={styles.logoImage}
            />
            <div className={styles.schoolInfo}>
              <h1>ভরাসার বহুমুখী উচ্চ বিদ্যালয়</h1>
              <p>১৯৬৫ সাল থেকে শিক্ষায় শ্রেষ্ঠত্ব</p>
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
            </div>
          )}

          <NavItem href="/" icon={FaHome} label="Home" />
          <NavItem
            href="/teachersAndStaff"
            icon={FaUsers}
            label="শিক্ষক ও কর্মচারী"
          />
          <NavItem
            href="/committee-members"
            icon={FaUsers}
            label="কমিটির সদস্যবৃন্দ"
          />
          <NavItem href="/gallery" icon={FaAward} label="গ্যালারি" />
          <NavItem href="/notice" icon={FaNewspaper} label="নোটিশ" />
          <NavItem href="/contact" icon={FaInfoCircle} label="যোগাযোগ" />
          <NavItem href="/login" icon={FaInfoCircle} label="লগইন" />
        </nav>

        <div className={styles.noticeBar}>
          <div className={styles.noticeLabel}>নোটিশ</div>
          <div className={styles.noticeContent}>
            <div className={styles.marquee}>
              {/* Dynamically show latest notice content */}
              {latestNotice ? (
                <span dangerouslySetInnerHTML={{ __html: latestNotice }} />
              ) : (
                "Loading latest notice..."
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;