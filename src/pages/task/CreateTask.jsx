import { useState } from "react";
import { useTasks } from "@/context/useTasks";

function CreateTask() {
    const { addTask } = useTasks();

    const [formData, setFormData] = useState({
        title: "",
        owner: "",
        status: "Todo",
        priority: "Medium",
        dueDate: "",
    });

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
            await addTask(formData);

            setFormData({
                title: "",
                owner: "",
                status: "Todo",
                priority: "Medium",
                dueDate: "",
            });

            console.log("Task created successfully");
        } catch (error) {
            console.error("Failed to create task:", error);
        }
    };

    return (
        <div className="mx-auto max-w-2xl">
            <h1 className="mb-6 text-2xl font-bold">
                Create Task
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
                        <option value="Todo">Todo</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
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
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>

                {/* Due date */}
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

                {/* Submit */}
                <button
                    type="submit"
                    className="rounded-lg bg-black px-5 py-2 text-white hover:bg-gray-800"
                >
                    Create Task
                </button>
            </form>
        </div>
    );
}

export default CreateTask;