// DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import CandidateSection from "../components/Candidate/CandidateSection";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect untuk memuat data user (otentikasi)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/user/me");
        setUser(res.data.data);
        localStorage.setItem("user", JSON.stringify(res.data.data));
      } catch (err) {
        setUser(null);
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  // useEffect untuk memuat data kandidat
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await api.get("/candidates");
        setCandidates(res.data.data);
      } catch (err) {
        console.error("Failed to fetch candidates", err);
      }
    };
    fetchCandidates();
  }, []);

  // Periksa loading state sebelum menampilkan konten
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen bg-white flex flex-col">
      <Navbar user={user} setUser={setUser} />
      <Hero />
      <CandidateSection candidates={candidates} />
    </main>
  );
};

export default DashboardPage;
