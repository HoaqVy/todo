
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "@/api/authApi";

function VerifyEmailFeature() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState(
        "Verifying your email..."
    );

    const verificationStarted = useRef(false);
    useEffect(() => {

        if (verificationStarted.current) return;

        verificationStarted.current = true;
        const token = searchParams.get("token");

        if (!token) {
            setStatus("error");
            setMessage("Verification token is missing.");
            return;
        }

        const confirmEmail = async () => {
            try {
                const data = await verifyEmail(token);

                setStatus("success");
                setMessage(data.message);

                // Redirect to Login after 2 seconds
                setTimeout(() => {
                    navigate("/login", {
                        state: {
                            message: "Your email has been verified. You can now log in."
                        }
                    });
                }, 2000);

            } catch (error) {
                setStatus("error");
                setMessage(error.message);
            }
        };

        confirmEmail();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg text-center">

                {status === "loading" && (
                    <div className="mb-4">
                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
                    </div>
                )}

                {status === "success" && (
                    <div className="mb-4 text-4xl text-green-500">
                        ✓
                    </div>
                )}

                {status === "error" && (
                    <div className="mb-4 text-4xl text-red-500">
                        ✕
                    </div>
                )}

                <h1 className="mb-3 text-2xl font-bold text-gray-800">
                    {status === "loading"
                        ? "Verifying Email"
                        : status === "success"
                            ? "Email Verified!"
                            : "Verification Failed"}
                </h1>

                <p className="text-gray-600">
                    {message}
                </p>

                {status === "error" && (
                    <button
                        onClick={() => navigate("/login")}
                        className="mt-6 rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
                    >
                        Go to Login
                    </button>
                )}

            </div>
        </div>
    );
}

export default VerifyEmailFeature;
