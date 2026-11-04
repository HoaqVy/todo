
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

import { changePassword } from "@/api/authApi";
import { useAuth } from "@/context/AuthContext";

function ChangePassword() {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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

        if (formData.newPassword.length < 6) {
            setError("New password must be at least 6 characters.");
            return;
        }

        if (formData.newPassword === formData.currentPassword) {
            setError("New password must be different from current password.");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            await changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });

            const updatedUser = {
                ...user,
                mustChangePassword: false,
            };

            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            alert("Password changed successfully!");

            navigate("/dashboard");

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
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                        <Lock size={26} className="text-blue-600" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-800">
                        Change Password
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Please update your password to continue.
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
                            Current Password
                        </label>

                        <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            placeholder="Enter current password"
                            className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            New Password
                        </label>

                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="Enter new password"
                            className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Confirm New Password
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm new password"
                            className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Updating..." : "Change Password"}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default ChangePassword;
