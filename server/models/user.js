const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  middleName: String,
  phoneNumber: {
    type: String,
    unique: true,
  },
  name: String,
  email: {
    type: String,
    unique: true,
  },
  username: {
    type: String,
    nique: true,
  },
  password: String,
});

const userModal = mongoose.model("User", userSchema);

module.exports = userModal;
