import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ProtectedUserRoute = ({ user, children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    } else if (user.role !== "user") {
      Swal.fire({
        icon: "error",
        title: "Akses Ditolak",
        text: "Anda bukan user",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/dashboard", { replace: true });
    }
  }, [user]);

  if (!user || user.role !== "user") return null;

  return children;
};

export default ProtectedUserRoute;
