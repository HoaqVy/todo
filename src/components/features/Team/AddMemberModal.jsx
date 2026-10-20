
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const initialForm = {
    name: "",
    email: "",
    position: "",
    role: "Member",
    status: "Active"
};

function AddMemberModal({
    onClose,
    onAdd,
    onUpdate,
    member = null,
}) {
    const [formData, setFormData] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState("")


    // Nếu có member, điền thông tin để chỉnh sửa
    useEffect(() => {
        if (member) {
            setFormData({
                name: member.name ?? "",
                email: member.email ?? "",
                position: member.position ?? "",
                role: member.role ?? "Member",
                status: member.status ?? "Active"
            });
        } else {
            setFormData(initialForm);
        }

        setErrors({});
        setSubmitError("")
    }, [member]);

    const isEditing = Boolean(member);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        const nextErrors = {};
        const name = formData.name.trim();
        const email = formData.email.trim();
        const position = formData.position.trim();

        // Validate Name
        if (!name) {
            nextErrors.name = "Name is required.";
        }

        // Validate Email
        if (!email) {
            nextErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            nextErrors.email = "Please enter a valid email.";
        }

        // Validate Position
        if (!position) {
            nextErrors.position = "Position is required.";
        }

        // Nếu dữ liệu không hợp lệ thì dừng
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        const memberData = {
            name,
            email,
            position,
            role: formData.role,
            status: formData.status
        };

        setIsSubmitting(true)
        setSubmitError("")

        // Gọi API thêm hoặc cập nhật
        try {
            if (isEditing) {
                await onUpdate(member.id, memberData);
            } else {
                await onAdd(memberData);
            }

            // Chỉ đóng modal khi thao tác thành công
            onClose();
        } catch (error) {
            // API lỗi thì giữ modal mở
            setSubmitError(
                error.message || "Falied to save team member"
            )
        } finally {
            setIsSubmitting(false)
        }
    };

    const inputClassName =
        "mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-500";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="member-modal-title"
                className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            >
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2
                            id="member-modal-title"
                            className="text-xl font-bold text-gray-900"
                        >
                            {submitError && (
                                <p
                                    role="alert"
                                    className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
                                >
                                    {submitError}
                                </p>
                            )}
                            {isEditing
                                ? "Edit Team Member"
                                : "Add Team Member"}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {isEditing
                                ? "Update this member's information."
                                : "Enter the information for the new member."}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-4"
                >
                    {/* Name */}
                    <div>
                        <label
                            htmlFor="member-name"
                            className="text-sm font-medium text-gray-700"
                        >
                            Full Name
                        </label>

                        <input
                            id="member-name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter full name"
                            className={inputClassName}
                            aria-invalid={Boolean(errors.name)}
                        />

                        {errors.name && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="member-email"
                            className="text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>

                        <input
                            id="member-email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="example@email.com"
                            className={inputClassName}
                            aria-invalid={Boolean(errors.email)}
                        />

                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Position */}
                    <div>
                        <label
                            htmlFor="member-position"
                            className="text-sm font-medium text-gray-700"
                        >
                            Position
                        </label>

                        <input
                            id="member-position"
                            name="position"
                            type="text"
                            value={formData.position}
                            onChange={handleChange}
                            placeholder="e.g. Frontend Developer"
                            className={inputClassName}
                            aria-invalid={Boolean(errors.position)}
                        />

                        {errors.position && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.position}
                            </p>
                        )}
                    </div>

                    {/* Role */}
                    <div>
                        <label
                            htmlFor="member-role"
                            className="text-sm font-medium text-gray-700"
                        >
                            Role
                        </label>

                        <select
                            id="member-role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className={inputClassName}
                        >
                            <option value="Admin">Admin</option>
                            <option value="Member">Member</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="status"
                            className="mb-1 block text-sm font-medium text-gray-700">
                            Status
                        </label>

                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={(event) => setFormData((prev) => ({
                                ...prev,
                                status: event.target.value
                            }))}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-gray-500">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting
                                ? "Saving..."
                                : isEditing
                                    ? "Save Changes"
                                    : "Add Member"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddMemberModal;
