import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import FormLogin from "../components/FormLogin/FormLogin";

const LoginPage = () => {
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
      const response = await api.post("auth/login", { nisn, password });
      console.log("Login sukses", response.data);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen flex items-center justify-center bg-gray-50 p-6 font-montserrat">
      <FormLogin
        nisn={nisn}
        password={password}
        loading={loading}
        error={error}
        handleNumberOnly={handleNumberOnly}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
      />
    </main>
  );
};

export default LoginPage;
