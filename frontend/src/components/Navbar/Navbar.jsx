import React from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import Swal from "sweetalert2";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin ingin logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
      customClass: {
      confirmButton: 'swal-confirm-button',
      cancelButton: 'swal-cancel-button'
    },
      buttonsStyling: false
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
          customClass: {
          confirmButton: 'swal-confirm-button',
          cancelButton: 'swal-cancel-button'
    },
      buttonsStyling: false
        });
      } finally {
        setUser(null);
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      }
    }
  };

  return (
    <nav className="w-full bg-red-600 shadow-md px-8 py-3 sm:px-18 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <img src="./favico.png" alt="Logo" className="w-10 h-10" />
      </div>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-white font-medium text-sm">
              Hi, {user.nisn}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-full bg-white w-8 h-8 flex items-center justify-center"
              title="logout"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-red-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                />
              </svg>
            </button>
          </>
        ) : (
          <span className="text-white font-medium text-sm">Loading...</span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
