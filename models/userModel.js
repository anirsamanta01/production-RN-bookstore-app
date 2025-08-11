import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      require: [true, "Email is required"],
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      require: [true, "Phone number is required"],
    },
    password: {
      type: String,
      require: [true, "Password is required"],
      min: 4,
      max: 36,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
