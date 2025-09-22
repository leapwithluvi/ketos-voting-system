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
      const loggedUser = response.data.data;
      setUser(loggedUser);

      Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        text: `Selamat datang, ${loggedUser.nama || loggedUser.nisn}`,
        showConfirmButton: false,
        timer: 1500,
      });

      // Cek role dan arahkan
      if (loggedUser.role === "admin") {
        navigate("/admin/candidates");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: err.response?.data?.message || "NISN / Password salah",
        customClass: {
        confirmButton: 'swal-confirm-button',
        cancelButton: 'swal-cancel-button'
    },
      buttonsStyling: false
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
