const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  test,
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  getUsers,
} = require("../controllers/authController");

//midleware
router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5174",
  })
);

router.get("/", test);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getProfile);
router.post("/logout", logoutUser);
router.get("/all-users", getUsers);

module.exports = router;
