// src/pages/home/board-of-directors.js
import React, { useEffect, useState } from 'react';
import DirectorsComponent from '@/components/Directors';
import BASE_URL from '@/components/config/apiConfig';

const BoardOfDirectors = () => {
  const [directors, setDirectors] = useState([]);
  const committee = 'Board of Directors'; // Define the committee you want to filter by

  useEffect(() => {
    const fetchDirectors = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/director?committee=${encodeURIComponent(committee)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setDirectors(data);
      } catch (error) {
        console.error("Error fetching directors:", error);
      }
    };

    fetchDirectors();
  }, [committee]); // Fetch directors when the component mounts or committee changes

  return (
    <div>
      <DirectorsComponent directors={directors} />
    </div>
  );
};

export default BoardOfDirectors;
