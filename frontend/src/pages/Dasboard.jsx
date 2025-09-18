import React, { useEffect, useState } from "react";
import Hero from "../components/Hero/Hero";
import {api} from '../api/api'
import CandidateSection from "../components/CandidateSection/CandidateSection";

const DashboardPage = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await api.get("candidates");
        setCandidates(res.data.data);
        console.log(res.data)
      } catch (err) {
        console.error("Failed to fetch candidates", err);
      }
    };

    fetchCandidates();
  }, []);

  return (
    <main className="w-full min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="w-full bg-red-600 shadow-md px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <img src="./favico.png" alt="Logo" className="w-10 h-10" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-medium text-sm">Hi, User</span>
          <img src="/user.png" className="w-10 h-10 invert" />
        </div>
      </nav>

      <Hero />
      <CandidateSection candidates={candidates} />
    </main>
  );
};

export default DashboardPage;
