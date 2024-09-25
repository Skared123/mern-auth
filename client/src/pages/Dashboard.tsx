import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, loading, setUser } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const logoutUser = async (e) => {
    e.preventDefault();
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

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/all-users");
      setUsers(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Error al obtener los usuarios.");
    }
  };

  useEffect(() => {
    if (user && !loading) {
      fetchUsers();
    }
  }, [user, loading]);

  if (loading) {
    return <h2>Cargando usuario...</h2>; // Mensaje de carga
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {user && !loading && (
        <>
          <h2>
            Hi, {user.firstName} {user.lastName}
          </h2>
          <button onClick={logoutUser}>Cerrar Sesion</button>
        </>
      )}
      <h2>Lista de Usuarios</h2>
      <table>
        <thead>
          <tr>
            <th>Correo</th>
            <th>Nombre</th>
            <th>Número de Teléfono</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>{user.firstName}</td>
              <td>{user.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
