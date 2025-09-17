import React from "react";

const Dashboard = () => {
  return (
    <main className="w-full min-h-screen bg-white flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full bg-white h-screen">
        {/* Gambar responsive fullscreen */}
        <img src="/background.jpeg" alt="Background" className="absolute inset-0 w-full h-full object-cover bg-white"/>

        {/* Overlay merah di atas */}
        <div className="absolute top-0 left-0 w-full bg-red-600 h-6 md:h-8 z-10" />

        {/* Konten hero */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
          <h1 className="text-white font-bold drop-shadow-lg leading-tight text-lg sm:text-xl md:text-3xl lg:text-4xl">
            PEMILIHAN KETUA OSIS <br /> SMAKENSA 2025/2026
          </h1>
          <button className="mt-3 sm:mt-4 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm md:text-base px-4 sm:px-6 py-2 rounded-full font-semibold transition">
            VOTING JAGOANMU
          </button>
        </div>
      </section>

      {/* Section Putih */}
      <section className="bg-white w-full py-8 sm:py-10 flex flex-col items-center">
        <button
          className="bg-red-600 hover:bg-red-700 text-white
                     text-xs sm:text-sm md:text-base px-4 sm:px-6 py-2
                     rounded-full font-semibold transition mb-6 sm:mb-10"
        >
          KANDIDAT KETOS
        </button>

        {/* Visi Misi */}
        <div className="max-w-md text-center px-4">
          <h2
            className="text-gray-900 font-bold mb-2
                       text-xl sm:text-2xl md:text-3xl"
          >
            VISI & MISI
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
