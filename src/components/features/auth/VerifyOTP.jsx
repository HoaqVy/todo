
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { verifyOTP } from "@/api/authApi";

function VerifyOTP() {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        try {
            setLoading(true);

            const data = await verifyOTP(email, otp);

            navigate("/reset-password", {
                state: {
                    email,
                    resetToken: data.resetToken,
                },
            });

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
                    <div className="mb-4 flex justify-center">
                        <ShieldCheck size={42} className="text-blue-600" />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        Verify OTP
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Enter the 6-digit code sent to your email.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {error && (
                        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Email Address
                        </label>

                        <input
                            type="email"
                            value={email}
                            readOnly
                            className="w-full rounded-lg border border-gray-300 bg-gray-100 p-3 text-gray-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            OTP Code
                        </label>

                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                setOtp(value);
                            }}
                            placeholder="Enter 6-digit OTP"
                            className="w-full rounded-lg border border-gray-300 p-3 text-center text-xl tracking-[0.5em] outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !email || otp.length !== 6}
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    <Link
                        to="/forgot-password"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Back to Forgot Password
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default VerifyOTP;
