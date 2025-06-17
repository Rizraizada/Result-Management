import React, { useState, useEffect } from "react";
import BASE_URL from "@/components/config/apiConfig";
import styles from "./index.module.css";

const TeacherSlider = () => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/auth/users`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const { users } = await response.json();
        setTeachers(users);
      } catch (error) {
        console.error("Error fetching teachers data:", error);
      }
    };

    fetchTeachers();
  }, []);

  const handleTeacherClick = () => {
    window.location.href = "/teachersAndStaff";
  };

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.sliderTrack}>
        {/* Render items twice to enable the train effect */}
        {teachers.concat(teachers).map((teacher, index) => (
          <div
            key={index}
            className={styles.sliderItem}
            onClick={handleTeacherClick}
          >
            <img
              src={`${BASE_URL}/uploads/${teacher.image}`}
              alt={teacher.full_name || "Teacher"}
              className={styles.teacherImage}
            />
            <h3 className={styles.teacherName}>{teacher.full_name}</h3>
            <p className={styles.teacherPosition}>{teacher.position}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherSlider;
