
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please provide name, email and password."
            });
        }

        // Check password length
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters."
            });
        }

        // Check existing email
        const existingUser = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already exists."
            });
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password
        });

        return res.status(201).json({
            message: "Account registered successfully.",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Register error:", error);

        return res.status(500).json({
            message: "Failed to register account."
        });
    }
};


// LOGIN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        //Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password"
            })
        }

        //Find user by email
        const user = await User.findOne({
            email: email.trim().toLowerCase()
        })

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        //Compare password
        const isPasswordValid = await user.comparePassword(password)

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        //Generate JWT 
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )
        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        console.error("Login error:", error);

        return res, status(500).json({
            message: "Failed to login"
        })

    }
}

//GET CURRENT USER
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password")

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        return res.status(200).json({
            user
        })
    } catch (error) {
        console.error("Get current user error:", error);

        return res.status(500).json(
            { message: "Failed to get user information" }
        )
    }
}