import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const token = localStorage.getItem("token");

  return (
    <nav className="bg-blue-600 p-5 shadow-md fixed top-0 w-full z-50">
      <div className="mx-auto flex items-center font-oxygen">
        <div className="text-white text-2xl mr-auto">FormPilot</div>
        <div className="flex space-x-6 ml-auto text-xl">
          <Link to="/form-builder" className="text-white hover:underline">
            Create Form
          </Link>
          <Link to="/forms" className="text-white hover:underline">
            Saved Forms
          </Link>
          {!token ? (
            <>
              <Link to="/login" className="text-white hover:underline">
                Login
              </Link>
              <Link to="/signup" className="text-white hover:underline">
                Signup
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-white hover:underline"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
