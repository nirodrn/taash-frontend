import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import myAnimation from '../animations/my-animation.json'; // Adjust the path if necessary

function Loading() {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Set a timeout to display the message after 5 seconds
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 5000); // 5000ms = 5 seconds

    // Cleanup the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white">
      {/* Lottie animation */}
      <div className="w-40 h-40">
        <Lottie animationData={myAnimation} loop={true} />
      </div>

      {/* Initial message */}
      <p className="text-black text-2xl font-semibold mt-4 animate-pulse">
        Loading, please wait...
      </p>

      {/* Timed message */}
      {showMessage && (
        <div className="mt-4 text-center">
          <p className="text-gray-700 text-lg">Are your internet slow?</p>
          <p className="text-gray-700 text-lg">
            Don't worry, I will try to load fast, okay?
          </p>
          <p className="text-gray-700 text-lg">Thank you for your patience!</p>
        </div>
      )}
    </div>
  );
}

export default Loading;
