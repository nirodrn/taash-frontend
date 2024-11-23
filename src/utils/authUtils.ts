// Check if the user is logged in
export const isLoggedIn = (): boolean => {
  const token = localStorage.getItem('authToken');
  return !!token;  // Returns true if token exists
};

// Get the logged-in username
export const getUsername = (): string | null => {
  return localStorage.getItem('username');
};

// Logout function (optional utility)
export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('username');
};
