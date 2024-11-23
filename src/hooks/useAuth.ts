import { useState, useEffect } from 'react';
import { getUser, logoutUser as apiLogoutUser } from '../lib/api';
import type { User } from '../types';
import { useStore } from '../store/useStore';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { setUser: setStoreUser, setAdmin } = useStore();

  // Handles login and logout
  const loginUser = (userData: User) => {
    setUser(userData);
    setStoreUser(userData);
    setAdmin(userData.isAdmin || false);
    localStorage.setItem('userToken', userData.token); // Store token in localStorage if available
  };

  const logoutUser = async () => {
    try {
      // Call your API to logout if needed
      await apiLogoutUser();
      localStorage.removeItem('userToken');  // Remove token from local storage
      setUser(null); // Clear user state
      setStoreUser(null); // Clear store user state
      setAdmin(false); // Reset admin status
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('userToken');  // Check if token exists in local storage
    if (token) {
      // Assuming the token represents a valid session, try to fetch user data
      (async () => {
        try {
          const userData = await getUser(token);  // Get user data from your API using the token
          loginUser(userData);  // Set user and update store
        } catch (error) {
          console.error('Error fetching user data from token:', error);
          logoutUser();  // Logout if fetching user data fails
        }
      })();
    } else {
      setUser(null);  // No token found, so set user to null
    }
    setLoading(false);  // Set loading to false after checking local storage
  }, []);

  return { user, loading, loginUser, logoutUser };
}
