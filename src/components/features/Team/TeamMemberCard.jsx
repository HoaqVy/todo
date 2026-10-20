import { Mail, Pencil, Trash2 } from "lucide-react";

function TeamMemberCard({ member, onEdit, onDelete, isDeleting = false }) {
    const initials = member.name
        .split(" ")
        .slice(-2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();

    // Status mặc định là Active nếu dữ liệu cũ chưa có trường này
    const status = member.status ?? "Active";

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 transition hover:shadow-sm">
            {/* Member information */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-700">
                        {initials}
                    </div>

                    <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900">
                            {member.name}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                            {member.position}
                        </p>
                    </div>
                </div>

                {/* Edit and Delete buttons */}
                <div className="flex shrink-0 gap-1">
                    <button
                        type="button"
                        onClick={() => onEdit(member)}
                        aria-label={`Edit ${member.name}`}
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                    >
                        <Pencil size={17} />
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(member.id)}
                        aria-label={`Delete ${member.name}`}
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                    >
                        {isDeleting ? (
                            <span className="text-xs">...</span>
                        ) : (
                            <Trash2 size={17} />
                        )}
                    </button>
                </div>
            </div>

            {/* Email */}
            <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">
                <Mail size={16} className="shrink-0" />
                <span className="break-all">{member.email}</span>
            </div>

            {/* Role */}
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-sm text-gray-500">Role</span>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {member.role}
                </span>
            </div>

            {/* Status */}
            <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-gray-500">Status</span>

                <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                        }`}
                >
                    {member.status ?? "Active"}
                </span>
            </div>
        </div>
    );
}

export default TeamMemberCard;