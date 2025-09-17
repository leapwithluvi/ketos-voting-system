import React from "react";

const LoadingScreen = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      {/* Spinner animasi */}
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-700 font-medium">Loading...</p>
    </div>
  );
};

export default LoadingScreen;
