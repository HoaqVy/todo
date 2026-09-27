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
            <div className="mx-auto max-w-2xl">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl">
            <h1 className="mb-6 text-2xl font-bold">
                Edit Task
            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-xl border border-gray-200 bg-white p-6"
            >
                {/* Title */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Title
                    </label>

                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter task title"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-gray-500"
                        required
                    />
                </div>

                {/* Owner */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Owner
                    </label>

                    <input
                        type="text"
                        name="owner"
                        value={formData.owner}
                        onChange={handleChange}
                        placeholder="Enter owner"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-gray-500"
                        required
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Status
                    </label>

                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2"
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
                    <label className="mb-2 block text-sm font-medium">
                        Priority
                    </label>

                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2"
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
                    <label className="mb-2 block text-sm font-medium">
                        Due Date
                    </label>

                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    />
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <Button
                        type="button"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                        variant="secondary"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        loading={loading}
                    >
                        Update Task
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default EditTask;