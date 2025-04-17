import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import BASE_URL from '@/components/config/apiConfig';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Run the logic only on the `/login` route
    if (router.pathname === '/login') {
      const fetchUser = async () => {
        try {
          const response = await fetch(`${BASE_URL}/api/auth/verifyToken`, {
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data);

            // Redirect based on role
            if (data.role === 'headmaster') {
              router.push('/admin/headmaster');
            } else if (data.role === 'teacher') {
              router.push('/admin/teacher-dashboard');
            } else {
              router.push('/'); 
            }
          } else {
            setUser(null); 
          }
        } catch (error) {
          console.error('Error verifying user:', error);
          setUser(null);
        }
      };

      fetchUser();
    }
  }, [router.pathname]);

  const login = (userData) => {
    setUser(userData);

    // Redirect based on role
    if (userData.role === 'headmaster') {
      router.push('/admin/headmaster');
    } else if (userData.role === 'teacher') {
      router.push('/admin/teacher-dashboard');
    } else {
      router.push('/'); // Default to home if role is unknown
    }
  };

  const logout = async () => {
    try {
      await fetch(`${BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      router.push('/'); // Redirect to home on logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
