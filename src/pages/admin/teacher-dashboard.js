import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/UserContext';

const TeacherDashboard = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      // Redirect to login if no user is present
      if (router.pathname !== '/login') {
        router.push('/login');
      }
    } else if (user.role === 'headmaster' || user.role === 'teacher') {
      // Redirect both headmasters and teachers to the admin/headmaster dashboard
      if (router.pathname !== '/admin/headmaster') {
        router.push('/admin/headmaster');
      }
    } else {
      // Redirect to unauthorized page for all other roles
      if (router.pathname !== '/unauthorized') {
        router.push('/unauthorized');
      }
    }
  }, [user, router.pathname, router]); // Include 'router' in the dependency array

  // This component will not render anything since the logic is now to redirect.
  // You might want to have a loading state or a different message here.
  return (
    <div>
      <p>Redirecting...</p>
    </div>
  );
};

export default TeacherDashboard;