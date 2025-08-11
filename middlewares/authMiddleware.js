import { expressjwt as jwt } from "express-jwt";
import dotenv from "dotenv";

dotenv.config();

export const requireSignIn = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});
