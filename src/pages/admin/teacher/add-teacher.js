import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/UserContext';
import Register from '@/components/Register';

const addteacher = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'headmaster') {
      router.push('/unauthorized');
    }
  }, [user]);

  return (
    user && user.role === 'headmaster' && (
        <Register />
    )
  );
};

export default addteacher;
