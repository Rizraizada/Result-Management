import React from 'react';
import NoticeBoardTable from '@/components/Notice'; // Adjust the path based on your project structure

const NoticePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">


      <main className="max-w-7xl mx-auto p-6">
        {/* Include the notice board table */}
        <NoticeBoardTable />
      </main>

     
    </div>
  );
};

export default NoticePage;
