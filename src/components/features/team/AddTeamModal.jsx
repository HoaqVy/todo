import { X } from "lucide-react"
import { useEffect, useState } from "react"

const initialForm = {
    name: "",
    description: "",
    status: "Active"
}

function AddTeamModal({
    onClose,
    onAdd,
    onUpdate,
    team = null
}) {
    const [formData, setFormData] = useState(initialForm)
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState("")
    const isEditing = Boolean(team)

    useEffect(() => {
        if (team) {
            setFormData({
                name: team.name ?? "",
                description: team.description ?? "",
                status: team.status ?? "Active",
            });
        } else {
            setFormData(initialForm);
        }

        setErrors({});
        setSubmitError("");
    }, [team]);

    const handleChange = (event) => {
        const { name, value } = event.target

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: ""
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const nextErrors = {}
        const name = formData.name.trim()
        const description = formData.description.trim()

        //validate name
        if (!name) {
            nextErrors.name = "Team name is required"
        }

        //nếu dữ liệu kh hợp lệ thì dừn
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors)
            return
        }

        const teamData = {
            name,
            description,
            status: formData.status
        }

        setIsSubmitting(true)
        setSubmitError("")

        try {
            if (isEditing) {
                await onUpdate(team._id, teamData)
            } else {
                await onAdd(teamData)
            }

            //Chỉ đóng modal khi thao tác thành công
            onClose()
        } catch (error) {
            setSubmitError(
                error.message || "Failed to save team"
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const inputClassName =
        "mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-500";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose()
                }
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="team-modal-title"
                className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            >
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2
                            id="team-modal-title" className="text-xl font-bold text-gray-900">
                            {isEditing ? "Edit Team" : "Add Team"}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {isEditing
                                ? "Update this team's information."
                                : "Enter the information for the new team."}
                        </p>
                    </div>

                    <button type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100">
                        <X size={20} />
                    </button>
                </div>
                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-4"
                >
                    {/* Team Name */}
                    <div>
                        <label
                            htmlFor="team-name"
                            className="text-sm font-medium text-gray-700"
                        >
                            Team Name
                        </label>

                        <input
                            id="team-name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter team name"
                            className={inputClassName}
                            aria-invalid={Boolean(errors.name)}
                        />

                        {errors.name && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            htmlFor="team-description"
                            className="text-sm font-medium text-gray-700"
                        >
                            Description
                        </label>

                        <textarea
                            id="team-description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter team description"
                            rows={3}
                            className={`${inputClassName} resize-none`}
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label
                            htmlFor="team-status"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Status
                        </label>

                        <select
                            id="team-status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className={inputClassName}
                        >
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
                                    : "Add Team"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddTeamModal;