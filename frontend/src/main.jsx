import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./index.css";
import LoginPage from "./pages/Login";
import DashboardPage from "./pages/Dasboard";
import NotFoundPage from "./pages/NotFound";
import VotingPage from "./pages/Voting";
import SuccessVote from "./pages/SuccessVote";
import LoadingPage from "./pages/Loading";
// import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage setUser={setUser} />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/voting" element={<VotingPage />} />
      <Route path="/success/:candidateNo" element={<SuccessVote />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
