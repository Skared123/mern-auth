import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    phoneNumber: "",
    email: "",
    username: "",
    password: "",
  });

  const registerUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      firstName,
      lastName,
      middleName,
      phoneNumber,
      email,
      username,
      password,
    } = data;
    try {
      const { data } = await axios.post("/register", {
        firstName,
        lastName,
        middleName,
        phoneNumber,
        email,
        username,
        password,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        setData({
          firstName: "",
          lastName: "",
          middleName: "",
          phoneNumber: "",
          email: "",
          username: "",
          password: "",
        });
        toast.success("Registration successful. Welcome! ");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full flex items-center">
      <form
        onSubmit={registerUser}
        className="flex flex-col max-w-[300px] mx-auto justify-center p-4"
      >
        <label>Nombre*</label>
        <input
          type="text"
          placeholder="Enter name..."
          value={data.firstName}
          onChange={(e) => setData({ ...data, firstName: e.target.value })}
        />
        <label>Apellido Paterno*</label>
        <input
          type="text"
          placeholder="Enter last name..."
          value={data.lastName}
          onChange={(e) => setData({ ...data, lastName: e.target.value })}
        />
        <label>Apellido Materno</label>
        <input
          type="text"
          placeholder="Enter middle name..."
          value={data.middleName}
          onChange={(e) => setData({ ...data, middleName: e.target.value })}
        />
        <label>Numero de telefono*</label>
        <input
          type="text"
          placeholder="Enter phone number..."
          value={data.phoneNumber}
          onChange={(e) => setData({ ...data, phoneNumber: e.target.value })}
        />
        <label>Correo</label>
        <input
          type="email"
          placeholder="Enter email..."
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <label>Nombre de usuario*</label>
        <input
          type="text"
          placeholder="Enter username..."
          value={data.username}
          onChange={(e) => setData({ ...data, username: e.target.value })}
        />
        <label>Contraseña*</label>
        <input
          type="password"
          placeholder="Enter password..."
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
