import mongoose from "mongoose";

const userRegisterSchema = new mongoose.Schema({
  username: String,
  password: String,
});

export const UserRegister = mongoose.model("Users", userRegisterSchema);
