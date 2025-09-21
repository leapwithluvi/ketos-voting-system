import React from "react";
import LoadingAnimation from "../components/LoadingAnimation/LoadingAnimation";

const LoadingPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      {/* Spinner animasi */}
      <LoadingAnimation />
    </div>
  );
};

export default LoadingPage;
