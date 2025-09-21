import { Link } from "react-router-dom";
import NotFound from "../components/NotFound/NotFound";

const NotFoundPage = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
    {/* Not Found */}
    <NotFound />
  </div>
);

export default NotFoundPage;
