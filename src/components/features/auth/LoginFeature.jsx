
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import {
    loginUser,
    resendVerificationEmail
} from "@/api/authApi";
import { useAuth } from "@/context/AuthContext";



function LoginFeature() {

    const navigate = useNavigate();
    const location = useLocation();

    const successMessage = location.state?.message;

    const { login } = useAuth();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState("");

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setResendMessage("");

        try {
            setLoading(true);

            const data = await loginUser(formData);

            login(data.user, data.token);

            if (data.user.mustChangePassword) {
                navigate("/change-password");
            } else {
                navigate("/dashboard");
            }

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        if (!formData.email.trim()) {
            setResendMessage("Please enter your email address first.");
            return;
        }

        try {
            setResendLoading(true);
            setResendMessage("");

            const data = await resendVerificationEmail(formData.email);

            setResendMessage(data.message);

        } catch (error) {
            setResendMessage(error.message);
        } finally {
            setResendLoading(false);
        }
    };

    const needsVerification =
        error === "Please verify your email before logging in.";

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Welcome Back
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Login to your account
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {successMessage && (
                        <p className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
                            {successMessage}
                        </p>
                    )}

                    {error && (
                        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    {needsVerification && (
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                            <p className="text-sm text-blue-700">
                                Haven't received your verification email?
                            </p>

                            <button
                                type="button"
                                onClick={handleResendVerification}
                                disabled={resendLoading}
                                className="mt-3 font-semibold text-blue-600 hover:underline disabled:opacity-50"
                            >
                                {resendLoading
                                    ? "Sending..."
                                    : "Resend Verification Email"}
                            </button>

                            {resendMessage && (
                                <p className="mt-2 text-sm text-blue-700">
                                    {resendMessage}
                                </p>
                            )}
                        </div>
                    )}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Email Address
                        </label>

                        <div className="flex items-center rounded-lg border border-gray-300 px-3">
                            <Mail size={18} className="text-gray-400" />

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="w-full bg-transparent p-3 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Password
                        </label>

                        <div className="flex items-center rounded-lg border border-gray-300 px-3">
                            <Lock size={18} className="text-gray-400" />

                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className="w-full bg-transparent p-3 outline-none"
                                required
                            />
                        </div>

                        <div className="flex justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-sm font-medium text-blue-600 hover:underline"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LoginFeature;
