import React from 'react';
import { Link } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web';
import RegisterForm from '../components/auth/RegisterForm';

function Register() {
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  });

  return (
    <animated.div style={fadeIn} className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center mb-8">Create Account</h2>
        <RegisterForm />
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-black hover:underline">
            Login
          </Link>
        </p>
      </div>
    </animated.div>
  );
}

export default Register;