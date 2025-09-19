import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import CandidateSection from "../components/CandidateSection/CandidateSection";

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("user/me");
        setUser(res.data.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    const fetchCandidates = async () => {
      try {
        const res = await api.get("candidates");
        setCandidates(res.data.data);
      } catch (err) {
        console.error("Failed to fetch candidates", err);
      }
    };

    fetchUser();
    fetchCandidates();
  }, []);

  return (
    <main className="w-full min-h-screen bg-white flex flex-col">
      <Navbar user={user} />
      <Hero />
      <CandidateSection candidates={candidates} />
    </main>
  );
};

export default DashboardPage;
