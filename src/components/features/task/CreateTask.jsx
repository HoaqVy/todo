import { useState } from "react";
import { useTasks } from "@/context/useTasks";
import { useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";
import { Undo2 } from "lucide-react";

function CreateTask() {
    const { addTask } = useTasks();
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        title: "",
        owner: "",
        status: "Todo",
        priority: "Medium",
        dueDate: "",
    });

    const [loading, setLoading] = useState(false)

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
            await addTask(formData);

            console.log("Task created successfully");

            navigate("/dashboard")
        } catch (error) {
            console.error("Failed to create task:", error);
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="mx-auto w-full max-w-2xl">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                    <h1 className="text-2xl font-bold text-black sm:text-4xl">
                        Create task
                    </h1>
                </div>

                <Button
                    href="/dashboard"
                    icon={Undo2}
                    size="icon"
                />
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="
                    mt-4 space-y-5
                    rounded-xl border border-gray-200 bg-white
                    p-4 shadow-sm
                    sm:mt-5 sm:p-6
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
                        <option value="Todo">Todo</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
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
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>


                {/* Due date */}
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

                {/* Submit */}
                <div className="pt-1">
                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full sm:w-auto"
                    >
                        Create Task
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default CreateTask;