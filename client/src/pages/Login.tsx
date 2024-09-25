import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    username_or_phonenumber: "",
    password: "",
  });

  const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { username_or_phonenumber, password } = data;
    try {
      const { data } = await axios.post("login", {
        username_or_phonenumber,
        password,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        setData({ username_or_phonenumber: "", password: "" });
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={loginUser} className="mx-auto flex flex-col">
        <label>Numero de telefono o nombre de usuario</label>
        <input
          type="text"
          placeholder="Enter phone number or username..."
          value={data.username_or_phonenumber}
          onChange={(e) =>
            setData({ ...data, username_or_phonenumber: e.target.value })
          }
        />
        <label>Contrasenia</label>
        <input
          type="password"
          placeholder="Enter password..."
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}
