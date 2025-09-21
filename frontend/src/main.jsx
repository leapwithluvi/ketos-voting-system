import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./index.css";
import LoginPage from "./pages/Login";
import DashboardPage from "./pages/Dasboard";
import NotFoundPage from "./pages/NotFound";
import VotingPage from "./pages/Voting";
import SuccessVotePage from "./pages/SuccessVote";
import LoadingPage from "./pages/Loading";
import AdminCandidatePage from "./pages/DashboardAdmin/Admin";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ProtectedUserRoute from "./components/ProctedUserRoute";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage setUser={setUser} />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedUserRoute user={user}>
            <DashboardPage />
          </ProtectedUserRoute>
        }
      />
      <Route
        path="/voting"
        element={
          <ProtectedUserRoute user={user}>
            <VotingPage />
          </ProtectedUserRoute>
        }
      />
      <Route
        path="/success/:candidateNo"
        element={
          <ProtectedUserRoute user={user}>
            <SuccessVotePage />
          </ProtectedUserRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />

      <Route
        path="/admin/candidates"
        element={
          <ProtectedAdminRoute user={user}>
            <AdminCandidatePage user={user} />
          </ProtectedAdminRoute>
        }
      />
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
