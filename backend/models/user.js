import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    //primary key for user identification
    type: String,
    required: true,
    unique: true,
  },

  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    required: true,
    default: "user",
  },

  isBlock: {
    type: Boolean,
    default: false,
  },

  isEmailVerified: {
    type: Boolean,
    default: false,
  },

  image: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
