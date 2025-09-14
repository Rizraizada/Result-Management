// src/pages/unauthorized.js
import Link from 'next/link';

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        Unauthorized Access
      </h1>
      <p className="text-gray-700 mb-6">
        You do not have permission to access this page.
      </p>
      <Link 
        href="/login" 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Return to Login
      </Link>
    </div>
  );
};

export default UnauthorizedPage;