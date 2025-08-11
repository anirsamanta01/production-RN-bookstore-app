import express from "express";
import {
  loginController,
  registerController,
  updateUserController,
} from "../controllers/userController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

//register
router.post("/register", registerController);

//login
router.post("/login", loginController);

//update
router.put("/update", requireSignIn, updateUserController);

export default router;
