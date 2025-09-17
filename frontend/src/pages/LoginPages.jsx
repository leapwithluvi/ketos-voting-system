import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

const LoginPages = () => {
  const [nisn, setNisn] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  const navigate = useNavigate();

  const handleNumberOnly = (e) => {
    setNisn(e.target.value.replace(/[^0-9]/g, ""));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/api/auth/login", { nisn, password });
      console.log("Login sukses", response.data);
      
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen flex items-center justify-center bg-gray-50 p-6 font-montserrat">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8"
      >
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
            value={nisn}
            maxLength={10}
            onChange={handleNumberOnly}
            className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 hover:border-red-400"
            placeholder="Masukkan NISN"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            name="password"
            type="password"
            value={password}
            maxLength={8}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 hover:border-red-400"
            placeholder="Masukkan password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-red-600 text-white px-4 py-2 font-medium hover:bg-red-700 transition-colors duration-200"
          disabled={loading}
        >
          {loading ? "Laoding..." : "Login"}
        </button>

        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

        <p className="mt-6 text-xs text-gray-400 text-center">
          Powered by <br /> Rekayasa Kreatif Studio
        </p>
      </form>
    </main>
  );
};

export default LoginPages;
