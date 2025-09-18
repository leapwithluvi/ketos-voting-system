import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/candidates/", {
          withCredentials: true,
        });
        setCandidates(res.data.data);
      } catch (err) {
        console.error("Failed to fetch candidates", err);
      }
    };

    fetchCandidates();
  }, []);

  return (
    <main className="w-full min-h-screen bg-white flex flex-col">
      {/*  Navbar */}
      <nav className="w-full bg-red-600 shadow-md px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="./favico.png" alt="Logo" className="w-10 h-10" />
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-medium text-sm">Hi, User</span>
          <img src="/user.png" className="w-10 h-10 invert" />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full bg-white h-screen">
        <img
          src="/background.jpeg"
          className="absolute inset-0 w-full h-full object-cover bg-white"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
          <h1 className="text-white font-bold drop-shadow-lg leading-tight text-xl sm:text-xl md:text-3xl lg:text-4xl">
            PEMILIHAN KETUA OSIS <br /> SMAKENSA 2025/2026
          </h1>
          <button className="mt-3 sm:mt-4 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm md:text-base px-4 sm:px-6 py-2 rounded-full font-semibold transition">
            VOTING JAGOANMU
          </button>
        </div>
      </section>

      {/* Section Putih */}
      <section className="bg-white w-full py-8 sm:py-10 flex flex-col items-center">
        <div className="w-full flex justify-center mb-10">
          <h2 className="text-gray-900 font-bold whitespace-nowrap text-center text-xl sm:text-2xl  lg:text-3xl">
            KANDIDAT KETUA & WAKIL KETUA OSIS
          </h2>
        </div>

        {/* Kandidat Section */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl px-4 justify-center">
          {candidates.map((c) => (
            <div
              key={c.no}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col w-full max-w-sm mx-auto"
            >
              {/* Header */}
              <h3 className="text-sm font-bold text-gray-600 mb-1">
                NO. {c.no}
              </h3>
              <h2 className="text-lg font-bold text-gray-900">
                {c.ketua.nama} & {c.wakil.nama}
              </h2>
              <p className="text-gray-500 text-xs mb-6">{c.slogan}</p>

              {/* Foto Ketua & Wakil */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Ketua */}
                <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center text-center shadow-sm">
                  <img
                    src={c.ketua.imageUrl}
                    alt={c.ketua.nama}
                    className="w-28 h-36 object-cover rounded-lg mb-2"
                  />
                  <p className="font-semibold text-sm">{c.ketua.nama}</p>
                  <p className="text-xs text-gray-500">Calon Ketua Osis</p>
                  <p className="text-xs text-gray-600">{c.ketua.kelas}</p>
                </div>

                {/* Wakil */}
                <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center text-center shadow-sm">
                  <img
                    src={c.wakil.imageUrl}
                    alt={c.wakil.nama}
                    className="w-28 h-36 object-cover rounded-lg mb-2"
                  />
                  <p className="font-semibold text-sm">{c.wakil.nama}</p>
                  <p className="text-xs text-gray-500">
                    Calon Wakil Ketua Osis
                  </p>
                  <p className="text-xs text-gray-600">{c.wakil.kelas}</p>
                </div>
              </div>

              {/* Jurusan Terkait */}
              <div className="mt-auto">
                <p className="text-xs font-semibold text-gray-600 mb-2">
                  Jurusan terkait
                </p>
                <div className="flex gap-2">
                  {c.jurusan.map((logo, i) => (
                    <img
                      key={i}
                      src={logo}
                      alt="jurusan"
                      className="w-10 h-10"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
