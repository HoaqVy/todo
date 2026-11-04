
import express from "express";
import {
    getCurrentUser,
    login,
    register,
    changePassword
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// REGISTER
router.post("/register", register);

// LOGIN
router.post("/login", login);

// GET CURRENT USER
router.get("/me", authMiddleware, getCurrentUser);

// CHANGE PASSWORD
router.put("/change-password", authMiddleware, changePassword);

export default router;
