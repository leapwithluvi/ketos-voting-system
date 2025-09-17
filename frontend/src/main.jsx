import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./index.css";
import LoginPages from "./pages/LoginPages";
import Dashboard from "./pages/DasboardPages";
import NotFound from "./pages/NotFound";
import LoadingScreen from "./components/Loading";

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScreen />;

  return (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<LoginPages />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="*" element={<NotFound />} />
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
