import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import FormLogin from "../components/FormLogin/FormLogin";
import Swal from "sweetalert2";

const LoginPage = ({ setUser }) => {
  const [nisn, setNisn] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  const navigate = useNavigate();

  const handleNumberOnly = (e) => {
    setNisn(e.target.value.replace(/[^0-9]/g, ""));
  };

  const handleNumberOnlyPassword = (e) => {
    setPassword(e.target.value.replace(/[^0-9]/g, ""));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post("auth/login", { nisn, password });
      console.log("Login sukses", response.data);

      setUser(response.data.data);

      Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        text: `Selamat datang, ${response.data.data.nama}`,
        showConfirmButton: false,
        timer: 1500,
      });
      console.log("Response API:", response.data);

      navigate("/dashboard");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: err.response?.data?.message || "NISN / Password salah",
      });
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
        handleNumberOnlyPassword={handleNumberOnlyPassword}
        handleSubmit={handleSubmit}
      />
    </main>
  );
};

export default LoginPage;
