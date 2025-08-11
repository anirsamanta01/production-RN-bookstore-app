import User from "../models/userModel.js";
import { comparePassword, hashPassword } from "../utils/features.js";
import JWT from "jsonwebtoken";

//register
export const registerController = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!(name || email || phone || password)) {
      return res.status(400).send({
        success: false,
        message: "All fields are required.",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "Email is already in use.",
      });
    }
    //hash password
    const hashedPassword = await hashPassword(password);

    //create and save user
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });
    res.status(201).send({
      success: true,
      message: "User created successfully, Please login.",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

//login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email || password)) {
      return res.status(400).send({
        success: false,
        message: "Email and password are required.",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "User not found.",
      });
    }
    //compare password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.send(500).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

//update
export const updateUserController = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const user = await User.findOne({ email });
    if (password && password.length < 4) {
      return res.status(400).send({
        success: false,
        message: "Password must be at least 4 characters long",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        name: name || user.name,
        phone: phone || user.phone,
        password: hashedPassword || user.password,
      },
      { new: true }
    );
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Profile updated, Please Login to continue",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};
