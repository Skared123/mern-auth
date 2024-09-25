const User = require("../models/user");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");

const test = (req, res) => {
  res.json("test is working");
};

const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      middleName,
      phoneNumber,
      email,
      username,
      password,
    } = req.body;

    console.log(req.body);

    // Regular expressions for validation
    const nameRegex = /^[a-zA-Z\s]{1,40}$/;
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const usernameRegex = /^[a-zA-Z0-9_]{1,30}$/;

    // Validate first name
    if (!firstName || !nameRegex.test(firstName)) {
      return res.json({
        error:
          "El nombre es requerido y no debe contener caracteres especiales. Máximo 40 caracteres.",
      });
    }

    // Validate last name
    if (!lastName || !nameRegex.test(lastName)) {
      return res.json({
        error:
          "El apellido paterno es requerido y no debe contener caracteres especiales. Máximo 40 caracteres.",
      });
    }

    // Validate middle name (optional)
    if (middleName && !nameRegex.test(middleName)) {
      return res.json({
        error:
          "El apellido materno no debe contener caracteres especiales. Máximo 40 caracteres.",
      });
    }

    // Validate phone number
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      return res.json({
        error:
          "El número de teléfono es requerido y debe contener exactamente 10 dígitos.",
      });
    }

    // Validate email
    if (!email || !emailRegex.test(email) || email.length > 40) {
      return res.json({
        error:
          "El correo es requerido, debe ser válido y no debe exceder 40 caracteres.",
      });
    }

    // Check if email already exists
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({ error: "El correo ya está registrado." });
    }

    const phoneNumberExist = await User.findOne({ phoneNumber });
    if (phoneNumberExist) {
      return res.json({ error: "El numero de telefono ya esta registrado" });
    }

    const usernameExist = await User.findOne({ username });
    if (usernameExist) {
      return res.json({ error: "El nombre de usuario ya esta registrado" });
    }

    // Validate username
    if (!username || !usernameRegex.test(username)) {
      return res.json({
        error:
          "El nombre de usuario es requerido, debe ser válido y no debe contener caracteres especiales. Máximo 30 caracteres.",
      });
    }

    // Validate password
    if (!password || password.length > 20) {
      return res.json({
        error: "La contraseña es requerida y no debe exceder 20 caracteres.",
      });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the user
    const user = await User.create({
      firstName,
      lastName,
      middleName,
      phoneNumber,
      email,
      username,
      password: hashedPassword,
    });

    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error del servidor" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username_or_phonenumber, password } = req.body;
    // Check if user exists by username or phone number
    const user = await User.findOne({
      $or: [
        { username: username_or_phonenumber },
        { phoneNumber: username_or_phonenumber },
      ],
    });

    //Check if password match
    const match = await comparePassword(password, user.password);
    if (match) {
      jwt.sign(
        {
          firstName: user.firstName,
          lastName: user.lastName,
          middleName: user.middleName,
          phoneNumber: user.phoneNumber,
          email: user.email,
          id: user._id,
          username: user.username,
        },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(user);
        }
      );
    } else {
      res.json({
        error: "Passwords not match!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const getProfile = async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
      if (err) throw err;
      res.json(user);
    });
  } else {
    res.json(null);
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find(); // Encuentra todos los usuarios en la colección
    res.json(users); // Devuelve los usuarios en formato JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

module.exports = {
  test,
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  getUsers,
};
