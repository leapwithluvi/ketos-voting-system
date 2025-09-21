import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ProtectedAdminRoute = ({ user, children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    } else if (user.role !== "admin") {
      Swal.fire({
        icon: "error",
        title: "Akses Ditolak",
        text: "Anda bukan admin",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/dashboard", { replace: true });
    }
  }, [user]);

  if (!user || user.role !== "admin") return null;

  return children;
};

export default ProtectedAdminRoute;
