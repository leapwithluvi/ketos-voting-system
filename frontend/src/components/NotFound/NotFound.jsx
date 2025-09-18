import React from "react";

const NotFound = () => {
  return (
    <>
      <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-6">Halaman tidak ditemukan</p>
      <Link
        to="/login"
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
      >
        Kembali ke Login
      </Link>
    </>
  );
};

export default NotFound;
