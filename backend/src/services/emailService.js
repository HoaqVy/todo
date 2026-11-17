import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Check Gmail SMTP connection
export const verifyEmailConnection = async () => {
    try {
        await transporter.verify();
        console.log("Gmail SMTP connection successful!");
    } catch (error) {
        console.error("Gmail SMTP connection failed:", error.message);
    }
};

export default transporter;
