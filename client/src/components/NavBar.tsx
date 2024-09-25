import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import toast from "react-hot-toast";
import axios from "axios";

export default function NavBar() {
  const { user, setUser } = useContext(UserContext);
  console.log(user);
  const navigate = useNavigate();
  const logoutUser = async () => {
    try {
      const response = await axios.post(
        "logout",
        {},
        { withCredentials: true }
      );
      if (response.data.message) {
        toast.success(response.data.message);
        setUser(null);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al cerrar sesión. Inténtalo de nuevo.");
    }
  };
  return !user ? (
    <nav className="bg-slate-100 flex justify-around p-4">
      <div>
        <Link to="/register">Register</Link>
      </div>
      <div>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  ) : (
    <nav className="bg-slate-100 flex justify-around p-4">
      <div>
        <Link to="/dashboard">DASHBOARD</Link>
      </div>
      <div onClick={logoutUser}>
        <p>Cerrar sesion</p>
      </div>
    </nav>
  );
}
