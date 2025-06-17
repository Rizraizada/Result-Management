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
    } else if (user.role !== 'headmaster' && user.role !== 'teacher') {
      // Redirect to unauthorized page for invalid roles
      if (router.pathname !== '/unauthorized') {
        router.push('/unauthorized');
      }
    }
  }, [user, router.pathname]); // Include dependencies

  return (
    user && (user.role === 'headmaster' || user.role === 'teacher') && (
      <div>Hello, Teacher or Headmaster</div>
    )
  );
};

export default TeacherDashboard;
