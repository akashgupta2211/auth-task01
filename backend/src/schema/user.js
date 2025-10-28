import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email already exists"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },

  password: { type: String, required: [true, "Password is required"] },

  username: {
    type: String,
    unique: [true, "Username already exists"],
    required: true,
    match: [/^[a-zA-Z0-9]+$/, "Username must contain only letters and numbers"],
    minLength: [3, "Username should be at least 3 characters"],
  },

  avatar: { type: String },
  role: {
    type: String,
    enum: ["user", "admin", "manager"],
    default: "user",
    required: true,
  },
});

userSchema.pre("save", async function saveUser(next) {
  const user = this;

  if (user.isModified("password")) {
    const salt = bcrypt.genSaltSync(9);
    const hashPassword = bcrypt.hashSync(user.password, salt);
    user.password = hashPassword;
  }
  user.avatar = `https://robohash.org/${user.username}`;
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
