
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { forgotPassword } from "@/api/authApi";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        try {
            setLoading(true);

            const data = await forgotPassword(email);

            navigate("/verify-otp", {
                state: {
                    email: email,
                },
            });
            setMessage(data.message);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Forgot Password
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Enter your email to receive a password reset code.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {error && (
                        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    {message && (
                        <p className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
                            {message}
                        </p>
                    )}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Email Address
                        </label>

                        <div className="flex items-center rounded-lg border border-gray-300 px-3">
                            <Mail size={18} className="text-gray-400" />

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full bg-transparent p-3 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Sending..." : "Send OTP"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Remember your password?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Back to Login
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default ForgotPassword;
