import User from "../models/User.js";
import jwt from "jsonwebtoken";
import TeamMember from "../models/TeamMember.js";
import PasswordReset from "../models/PasswordReset.js";
import transporter from "../services/emailService.js";
import crypto from "crypto";



// GET USER TEAM INFORMATION
const getUserTeamInfo = async (email) => {
    const teamMember = await TeamMember.findOne({
        email: email.toLowerCase()
    }).populate("teamId", "name");

    if (!teamMember) {
        return null;
    }

    return {
        teamId: teamMember.teamId?._id || null,
        teamName: teamMember.teamId?.name || null,
        teamRole: teamMember.role,
        status: teamMember.status
    };
};


// GENERATE OTP
const generateOTP = () => {
    return crypto.randomInt(100000, 1000000).toString();
};

// HASH OTP
const hashOTP = (otp) => {
    return crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");
};


// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // 1. Validate email
        if (!email || !email.trim()) {
            return res.status(400).json({
                message: "Please provide your email."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // 2. Find user
        const user = await User.findOne({
            email: normalizedEmail
        });

        // Do not reveal whether the email exists
        if (!user) {
            return res.status(200).json({
                message: "If this email is registered, an OTP will be sent."
            });
        }

        // 3. Generate OTP
        const otp = generateOTP();
        const otpHash = hashOTP(otp);

        // 4. Save hashed OTP
        await PasswordReset.findOneAndUpdate(
            { email: normalizedEmail },
            {
                email: normalizedEmail,
                otpHash,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000),
                attempts: 0
            },
            {
                upsert: true,
                new: true,
                runValidators: true
            }
        );

        // 5. Send OTP email
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: normalizedEmail,
            subject: "Todo App - Password Reset OTP",
            text: `Your password reset OTP is: ${otp}. It expires in 5 minutes.`
        });

        return res.status(200).json({
            message: "If this email is registered, an OTP will be sent."
        });

    } catch (error) {
        console.error("Forgot password error:", error);

        return res.status(500).json({
            message: "Failed to process password reset request."
        });
    }
};



// VERIFY OTP
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // 1. Validate input
        if (!email || !otp) {
            return res.status(400).json({
                message: "Please provide email and OTP."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (!/^\d{6}$/.test(otp)) {
            return res.status(400).json({
                message: "OTP must contain exactly 6 digits."
            });
        }

        // 2. Find password reset record
        const resetRecord = await PasswordReset.findOne({
            email: normalizedEmail
        });

        if (!resetRecord) {
            return res.status(400).json({
                message: "Invalid or expired OTP."
            });
        }

        // 3. Check expiration
        if (resetRecord.expiresAt <= new Date()) {
            await PasswordReset.deleteOne({
                _id: resetRecord._id
            });

            return res.status(400).json({
                message: "OTP has expired. Please request a new one."
            });
        }

        // 4. Check maximum attempts
        if (resetRecord.attempts >= 5) {
            await PasswordReset.deleteOne({
                _id: resetRecord._id
            });

            return res.status(429).json({
                message: "Too many attempts. Please request a new OTP."
            });
        }

        // 5. Compare OTP hash
        const submittedHash = hashOTP(otp);

        if (submittedHash !== resetRecord.otpHash) {
            resetRecord.attempts += 1;
            await resetRecord.save();

            return res.status(400).json({
                message: "Invalid OTP."
            });
        }

        // 6. Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // 7. Save hashed reset token
        resetRecord.resetTokenHash = hashOTP(resetToken);

        // Prevent OTP from being reused
        resetRecord.otpHash = null;

        // Give reset token 10 minutes
        resetRecord.expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await resetRecord.save();

        // 8. Return reset token
        return res.status(200).json({
            message: "OTP verified successfully.",
            resetToken
        });

    } catch (error) {
        console.error("Verify OTP error:", error);

        return res.status(500).json({
            message: "Failed to verify OTP."
        });
    }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
    try {
        const { email, resetToken, newPassword } = req.body;

        // 1. Validate input
        if (!email || !resetToken || !newPassword) {
            return res.status(400).json({
                message: "Please provide email, reset token and new password."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // 2. Validate password length
        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters."
            });
        }

        // 3. Find reset record
        const resetRecord = await PasswordReset.findOne({
            email: normalizedEmail
        });

        if (!resetRecord || !resetRecord.resetTokenHash) {
            return res.status(400).json({
                message: "Invalid or expired reset token."
            });
        }

        // 4. Check token expiration
        if (resetRecord.expiresAt <= new Date()) {
            await PasswordReset.deleteOne({
                _id: resetRecord._id
            });

            return res.status(400).json({
                message: "Reset token has expired. Please try again."
            });
        }

        // 5. Verify reset token
        const submittedTokenHash = hashOTP(resetToken);

        if (submittedTokenHash !== resetRecord.resetTokenHash) {
            return res.status(400).json({
                message: "Invalid reset token."
            });
        }

        // 6. Find user
        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        // 7. Update password
        user.password = newPassword;
        user.mustChangePassword = false;

        await user.save();

        // 8. Delete reset record (one-time use)
        await PasswordReset.deleteOne({
            _id: resetRecord._id
        });

        return res.status(200).json({
            message: "Password reset successfully. Please login with your new password."
        });

    } catch (error) {
        console.error("Reset password error:", error);

        return res.status(500).json({
            message: "Failed to reset password."
        });
    }
};



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
        const teamInfo = await getUserTeamInfo(user.email);
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
                role: user.role,
                mustChangePassword: user.mustChangePassword,
                teamInfo
            }
        })
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
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

        const teamInfo = await getUserTeamInfo(user.email);

        return res.status(200).json({
            user: {
                ...user.toObject(),
                teamInfo
            }
        });
    } catch (error) {
        console.error("Get current user error:", error);

        return res.status(500).json(
            { message: "Failed to get user information" }
        )
    }
}


// UPDATE PROFILE
export const updateProfile = async (req, res) => {
    try {
        const { name } = req.body;

        // 1. Validate name
        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Name is required."
            });
        }

        // 2. Find logged-in User
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        // 3. Update User name
        user.name = name.trim();

        await user.save();

        // 4. Sync TeamMember name using email
        await TeamMember.findOneAndUpdate(
            { email: user.email },
            { name: user.name }
        );

        // 5. Get updated Team information
        const teamInfo = await getUserTeamInfo(user.email);

        // 6. Return updated information
        return res.status(200).json({
            message: "Profile updated successfully.",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                mustChangePassword: user.mustChangePassword,
                teamInfo
            }
        });

    } catch (error) {
        console.error("Update profile error:", error);

        return res.status(500).json({
            message: "Failed to update profile."
        });
    }
};


// CHANGE PASSWORD
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // 1. Kiểm tra dữ liệu đầu vào
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Please provide current password and new password."
            });
        }

        // 2. Kiểm tra độ dài mật khẩu mới
        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "New password must be at least 6 characters."
            });
        }

        // 3. Tìm User đang đăng nhập
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        // 4. Kiểm tra mật khẩu hiện tại
        const isPasswordValid = await user.comparePassword(currentPassword);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Current password is incorrect."
            });
        }

        // 5. Cập nhật mật khẩu mới
        user.password = newPassword;
        user.mustChangePassword = false;

        await user.save();

        return res.status(200).json({
            message: "Password changed successfully."
        });

    } catch (error) {
        console.error("Change password error:", error);

        return res.status(500).json({
            message: "Failed to change password."
        });
    }
};
