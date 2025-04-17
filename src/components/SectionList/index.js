// src/components/SectionList.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchSections } from '../config/apiConfig';  // Import the API call

const SectionList = () => {
  const router = useRouter();
  const { classId } = router.query;
  const [sections, setSections] = useState([]);

  useEffect(() => {
    if (classId) {
      const loadSections = async () => {
        try {
          const data = await fetchSections(classId);
          setSections(data);
        } catch (error) {
          console.error('Error loading sections:', error);
        }
      };
      
      loadSections();
    }
  }, [classId]);

  return (
    <div>
      <h2>Sections</h2>
      <ul>
        {sections.map((section) => (
          <li key={section.id}>
            <a href={`/section/${section.id}`}>{section.section_name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SectionList;
