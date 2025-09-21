import React from "react";
import { api } from "../../api/api";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const votingNavigate = async () => {
    try {
      navigate("/voting");
    } catch (err) {
      console.error("Gagal pindah halaman", err);
    }
  };

  return (
    <section className="relative w-full bg-white h-screen">
      <img
        src="/background.jpeg"
        className="absolute inset-0 w-full h-full object-cover bg-white"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <h1 className="text-white font-bold drop-shadow-lg leading-tight text-xl sm:text-xl md:text-3xl lg:text-4xl">
          PEMILIHAN KETUA OSIS <br /> SMAKENSA 2025/2026
        </h1>
        <button
          onClick={votingNavigate}
          className="mt-3 sm:mt-4 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm md:text-base px-4 sm:px-6 py-2 rounded-full font-semibold transition"
        >
          VOTING JAGOANMU
        </button>
      </div>
    </section>
  );
};

export default Hero;
