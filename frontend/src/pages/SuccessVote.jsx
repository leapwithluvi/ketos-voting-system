import React from "react";
import { useParams, useLocation, Navigate } from "react-router-dom";

const SuccessVote = () => {
  const { candidateNo } = useParams();
  const location = useLocation();
  const user = location.state?.user || JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/voting" />;
  }

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white shadow-lg rounded-2xl p-10 text-center max-w-md">
        <h1 className="text-2xl font-bold text-green-700">
          🎉 Selamat, {user.nama}!
        </h1>
        <p className="mt-4 text-lg text-gray-700">
          Anda berhasil memilih kandidat nomor{" "}
          <span className="font-bold">{candidateNo}</span>.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Halaman ini hanya bisa diakses oleh akun Anda.
        </p>
      </div>
    </main>
  );
};

export default SuccessVote;
