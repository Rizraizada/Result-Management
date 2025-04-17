import React from 'react';
import { useRouter } from 'next/router';
import BASE_URL from '@/components/config/apiConfig';

// Notice Details Page Component
const NoticeDetails = ({ notice }) => {
  const router = useRouter();

  // Handle loading state
  if (router.isFallback) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If no notice found
  if (!notice) {
    return <div className="text-center py-10">Notice not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{notice.title}</h1>
        <p className="text-lg text-gray-500 mt-2">
          {new Date(notice.date).toLocaleDateString('bn-BD', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-800 whitespace-pre-wrap">{notice.content}</p>
        {notice.downloadLink && (
          <div className="mt-4">
            <a
              href={notice.downloadLink}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Download Notice
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

// Fetch static paths for all notices
export async function getStaticPaths() {
  try {
    const res = await fetch(`${BASE_URL}/api/notices`);
    if (!res.ok) {
      throw new Error(`Failed to fetch notices: ${res.status}`);
    }

    const notices = await res.json();

    // Generate paths for each notice
    const paths = notices.map((notice) => ({
      params: { id: notice.id.toString() },
    }));

    return {
      paths,
      fallback: true, // Enable dynamic generation for new notices
    };
  } catch (error) {
    console.error('Error fetching notice paths:', error);
    return {
      paths: [],
      fallback: true,
    };
  }
}

// Fetch notice details for specific path
export async function getStaticProps({ params }) {
  try {
    const res = await fetch(`${BASE_URL}/api/notices/${params.id}`);
    if (!res.ok) {
      return {
        notFound: true,
      };
    }

    const notice = await res.json();

    return {
      props: { notice },
      revalidate: 60, // Regenerate page every 60 seconds
    };
  } catch (error) {
    console.error('Error fetching notice details:', error);
    return {
      notFound: true,
    };
  }
}

export default NoticeDetails;
