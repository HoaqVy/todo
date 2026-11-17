
import express from "express";
import {
    getCurrentUser,
    login,
    register,
    changePassword,
    updateProfile,
    forgotPassword,
    verifyOTP,
    resetPassword
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// REGISTER
router.post("/register", register);

// LOGIN
router.post("/login", login);

// GET CURRENT USER
router.get("/me", authMiddleware, getCurrentUser);

// UPDATE PROFILE
router.put("/profile", authMiddleware, updateProfile);

// CHANGE PASSWORD
router.put("/change-password", authMiddleware, changePassword);

// FORGOT PASSWORD
router.post("/forgot-password", forgotPassword);

// VERIFY OTP
router.post("/verify-otp", verifyOTP);

// RESET PASSWORD
router.post("/reset-password", resetPassword);

export default router;
