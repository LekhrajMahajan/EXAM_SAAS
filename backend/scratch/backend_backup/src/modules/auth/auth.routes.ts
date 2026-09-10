import { Router } from "express";

import {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
} from "./auth.controller";

import { validate } from "../../middleware/validate";
import { authenticate } from "../../middleware/authenticate";

import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "./auth.validation";

const router = Router();

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  forgotPassword,
);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  resetPassword,
);

router.post(
  "/verify-email",
  validate(verifyEmailSchema),
  verifyEmail,
);

router.post("/refresh-token", validate(refreshTokenSchema), refreshToken);

router.post("/logout", authenticate, logout);

router.get("/profile", authenticate, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

router.get("/me", authenticate, getProfile);

router.patch(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  changePassword,
);

export default router;
