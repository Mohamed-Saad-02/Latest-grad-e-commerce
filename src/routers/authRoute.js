import express from "express";
import {
  refreshToken,
  resetPassword,
  signin,
  signup,
} from "../controllers/auth.controller.js";
import validateSchema from "../middlewares/validateSchema.js";
import {
  resetPasswordSchema,
  signinSchema,
  signupSchema,
} from "../validators/auth.validator.js";

const authRouter = express.Router();

authRouter.post("/signup", validateSchema(signupSchema), signup);
authRouter.post("/login", validateSchema(signinSchema), signin);

authRouter.post("/refresh-token", refreshToken);

authRouter.post(
  "/reset-password",
  validateSchema(resetPasswordSchema),
  resetPassword
);

export default authRouter;
