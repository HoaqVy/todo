
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateProfile } from "@/api/authApi";
import {
    UserRound,
    Mail,
    ShieldCheck,
    Pencil,
    Save,
    X,
    Users,
    BriefcaseBusiness,
    CircleCheck,
} from "lucide-react";

function MyProfileFeature() {
    const { user, setUser } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSave = async () => {
        setError("");

        if (!name.trim()) {
            setError("Name is required.");
            return;
        }

        try {
            setLoading(true);

            const data = await updateProfile({
                name: name.trim(),
            });

            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));

            setIsEditing(false);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setName(user?.name || "");
        setError("");
        setIsEditing(false);
    };

    return (
        <div className="mx-auto max-w-4xl p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">
                    My Profile
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Manage your personal account information.
                </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                        <UserRound size={30} className="text-blue-600" />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            {user?.name || "User"}
                        </h2>

                        <p className="text-sm text-gray-500">
                            {user?.role || "Member"}
                        </p>
                    </div>
                </div>

                <div className="mb-5 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">
                        Profile Information
                    </h3>

                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                        >
                            <Pencil size={16} />
                            Edit
                        </button>
                    )}
                </div>

                {error && (
                    <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </p>
                )}

                <div className="space-y-5">
                    <div>
                        <p className="mb-2 text-sm font-medium text-gray-500">
                            Full Name
                        </p>

                        {isEditing ? (
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
                                placeholder="Enter your name"
                            />
                        ) : (
                            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                                <UserRound size={18} className="text-gray-400" />
                                <span className="text-gray-700">
                                    {user?.name || "Not available"}
                                </span>
                            </div>
                        )}
                    </div>

                    <div>
                        <p className="mb-2 text-sm font-medium text-gray-500">
                            Email Address
                        </p>

                        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                            <Mail size={18} className="text-gray-400" />
                            <span className="text-gray-700">
                                {user?.email || "Not available"}
                            </span>
                        </div>
                    </div>

                    <div>
                        <p className="mb-2 text-sm font-medium text-gray-500">
                            System Role
                        </p>

                        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                            <ShieldCheck size={18} className="text-gray-400" />
                            <span className="text-gray-700">
                                {user?.role || "Member"}
                            </span>
                        </div>
                    </div>
                    {/* Team Information */}
                    <div className="border-t border-gray-200 pt-5">
                        <h3 className="mb-4 font-semibold text-gray-800">
                            Team Information
                        </h3>

                        {user?.teamInfo ? (
                            <div className="space-y-4">
                                {/* Team Name */}
                                <div>
                                    <p className="mb-2 text-sm font-medium text-gray-500">
                                        Team Name
                                    </p>

                                    <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                                        <Users size={18} className="text-gray-400" />
                                        <span className="text-gray-700">
                                            {user.teamInfo.teamName || "Not available"}
                                        </span>
                                    </div>
                                </div>

                                {/* Team Role */}
                                <div>
                                    <p className="mb-2 text-sm font-medium text-gray-500">
                                        Team Role
                                    </p>

                                    <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                                        <BriefcaseBusiness size={18} className="text-gray-400" />
                                        <span className="text-gray-700">
                                            {user.teamInfo.teamRole || "Not available"}
                                        </span>
                                    </div>
                                </div>

                                {/* Team Status */}
                                <div>
                                    <p className="mb-2 text-sm font-medium text-gray-500">
                                        Team Status
                                    </p>

                                    <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                                        <CircleCheck size={18} className="text-gray-400" />
                                        <span className="text-gray-700">
                                            {user.teamInfo.status || "Not available"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
                                You are not assigned to any team.
                            </p>
                        )}
                    </div>
                </div>

                {isEditing && (
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={handleCancel}
                            disabled={loading}
                            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                        >
                            <X size={16} />
                            Cancel
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            <Save size={16} />
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyProfileFeature;
