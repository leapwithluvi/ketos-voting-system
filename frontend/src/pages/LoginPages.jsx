import React from "react";

const LoginPages = () => {
  const handleNumberOnly = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  };

  return (
    <main className="h-screen flex items-center justify-center bg-gray-50 p-6 font-montserrat">
      <form className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-xl font-semibold text-gray-800 text-center leading-snug mb-6">
          PEMILIHAN KETUA OSIS <br /> SMAKENSA TAHUN 2025/2026
        </h1>

        <div className="mb-4 py-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            NISN
          </label>
          <input
            name="nisn"
            type="text"
            maxLength={9}
            onInput={handleNumberOnly}
            className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 hover:border-red-400"
            placeholder="Masukkan NISN"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            name="password"
            type="password"
            maxLength={8}
            onInput={handleNumberOnly}
            className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 hover:border-red-400"
            placeholder="Masukkan password"
          />
        </div>

        <button
          type="button"
          className="w-full rounded-lg bg-red-600 text-white px-4 py-2 font-medium hover:bg-red-700 transition-colors duration-200"
        >
          Login
        </button>

        <p className="mt-6 text-xs text-gray-400 text-center">
          Powered by <br /> Rekayasa Kreatif Studio
        </p>
      </form>
    </main>
  );
};

export default LoginPages;
