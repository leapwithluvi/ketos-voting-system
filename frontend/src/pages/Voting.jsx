import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import Navbar from "../components/Navbar/Navbar";
import VotingSection from "../components/Voting/VotingSection";

const Voting = () => {
  const [user, setUser] = useState([]);
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
        console.error("Failed to fetch candidates");
      }
    };

    fetchUser();
    fetchCandidates();
  }, []);

  return (
    <main className="w-full min-h-screen bg-white flex flex-col">
      <Navbar user={user} setUser={setUser} />
      <VotingSection votings={candidates} user={user} />
    </main>
  );
};

export default Voting;
