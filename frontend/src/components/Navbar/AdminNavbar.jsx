import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { api } from "@/api/api"; // pastikan path sesuai

export default function AdminNavbar({ setUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin ingin logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
      customClass: {
        confirmButton: "swal-confirm-button",
        cancelButton: "swal-cancel-button",
      },
      buttonsStyling: false,
    });
    if (result.isConfirmed) {
      try {
        await api.post("/user/logout", {});
        Swal.fire({
          icon: "success",
          title: "Logout Berhasil",
          showConfirmButton: false,
          timer: 1000,
        });
      } catch (err) {
        console.error("Logout gagal", err);
        Swal.fire({
          icon: "error",
          title: "Logout Gagal",
          text: err.response?.data?.message || "Terjadi kesalahan",
        });
      } finally {
        if (setUser) setUser(null);
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      }
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold text-red-600">Dashboard Admin</div>

        {/* Menu Desktop */}
        <div className="hidden md:flex space-x-6 items-center">
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>

        {/* Menu Mobile */}
        <div className="md:hidden">
          <Button variant="outline" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Dropdown Mobile */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md border-t">
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white mt-2 mb-2"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      )}
    </nav>
  );
}
