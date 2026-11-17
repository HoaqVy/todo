
import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        otpHash: {
            type: String,
            default: null,
        },
        resetTokenHash: {
            type: String,
            default: null,
        },

        expiresAt: {
            type: Date,
            required: true,
        },

        attempts: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Automatically remove expired OTP records
passwordResetSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

const PasswordReset = mongoose.model(
    "PasswordReset",
    passwordResetSchema
);

export default PasswordReset;
