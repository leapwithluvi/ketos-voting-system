import React from "react";

const LoadingAnimation = () => {
  return (
    <>
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-700 font-medium">Loading...</p>
    </>
  );
};

export default LoadingAnimation;
