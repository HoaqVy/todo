import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useTasks } from "@/context/useTasks";
import Button from "@/components/common/Button";

function EditTask() {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        tasks = [],
        updateTask,
    } = useTasks();

    const [formData, setFormData] = useState({
        title: "",
        owner: "",
        status: "Todo",
        priority: "Medium",
        dueDate: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const task = tasks.find(
            (task) => task._id === id
        );

        if (!task) {
            setError("Task not found");
            return;
        }

        setFormData({
            title: task.title || "",
            owner: task.owner || "",
            status: task.status || "Todo",
            priority: task.priority || "Medium",
            dueDate: task.dueDate
                ? task.dueDate.slice(0, 10)
                : "",
        });
    }, [tasks, id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true)
            await updateTask(id, formData);

            navigate("/dashboard");
        } catch (error) {
            console.error(
                "Failed to update task:",
                error
            );

            setError("Failed to update task");
        } finally {
            setLoading(false)
        }
    };

    if (error) {
        return (
            <div className="mx-auto w-full max-w-2xl">
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-600">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl">

            {/* Header */}
            <div className="mb-4 sm:mb-5">
                <h1 className="text-2xl font-bold text-black sm:text-4xl">
                    Edit Task
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Update your task information
                </p>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="
                    space-y-5
                    rounded-xl border border-gray-200 bg-white
                    p-4 shadow-sm
                    sm:p-6
                "
            >
                {/* Title */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Title
                    </label>

                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter task title"
                        className="
                            h-11 w-full rounded-lg border border-gray-300
                            px-4 text-sm outline-none
                            transition focus:border-gray-500 focus:ring-2
                            focus:ring-gray-100
                        "
                        required
                    />
                </div>

                {/* Owner */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Owner
                    </label>

                    <input
                        type="text"
                        name="owner"
                        value={formData.owner}
                        onChange={handleChange}
                        placeholder="Enter owner"
                        className="
                            h-11 w-full rounded-lg border border-gray-300
                            px-4 text-sm outline-none
                            transition focus:border-gray-500 focus:ring-2
                            focus:ring-gray-100
                        "
                        required
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Status
                    </label>

                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="
                            h-11 w-full rounded-lg border border-gray-300
                            bg-white px-4 text-sm outline-none
                            transition focus:border-gray-500 focus:ring-2
                            focus:ring-gray-100
                        "
                    >
                        <option value="Todo">
                            Todo
                        </option>

                        <option value="In Progress">
                            In Progress
                        </option>

                        <option value="Completed">
                            Completed
                        </option>
                    </select>
                </div>

                {/* Priority */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Priority
                    </label>

                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="
                            h-11 w-full rounded-lg border border-gray-300
                            bg-white px-4 text-sm outline-none
                            transition focus:border-gray-500 focus:ring-2
                            focus:ring-gray-100
                        "
                    >
                        <option value="Low">
                            Low
                        </option>

                        <option value="Medium">
                            Medium
                        </option>

                        <option value="High">
                            High
                        </option>
                    </select>
                </div>

                {/* Due Date */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Due Date
                    </label>

                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="
                            h-11 w-full rounded-lg border border-gray-300
                            bg-white px-4 text-sm outline-none
                            transition focus:border-gray-500 focus:ring-2
                            focus:ring-gray-100
                        "
                    />
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                    <Button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        variant="secondary"
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full sm:w-auto"
                    >
                        Update Task
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default EditTask;