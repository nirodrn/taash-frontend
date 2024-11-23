import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../../lib/api';  // Import your login function
import toast from 'react-hot-toast';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Capture the current location

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call loginUser and get the token
      const token = await loginUser(email, password);

      // Save the token to localStorage
      localStorage.setItem('authToken', token);

      // Log the token to verify it's saved
      console.log('Token saved to localStorage:', localStorage.getItem('authToken'));

      toast.success('Successfully logged in!');

      // Get the location from which the user came (if any) or fallback to home
      const redirectTo = location.state?.from?.pathname || '/';

      // Redirect to the intended page (checkout, or home page if none)
      navigate(redirectTo);

    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 disabled:bg-gray-400"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

export default LoginForm;
