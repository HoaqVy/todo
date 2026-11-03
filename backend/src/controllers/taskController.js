
import mongoose from "mongoose";
import Task from "../models/Task.js";
import User from "../models/User.js"

const validStatuses = ["Todo", "In Progress", "Completed"];
const validPriorities = ["Low", "Medium", "High"];

// GET: Lấy danh sách task
export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });

        return res.status(200).json(tasks);
    } catch (error) {
        console.error("GET TASKS ERROR:", error);

        return res.status(500).json({
            message: "Failed to fetch tasks",
        });
    }
};

// POST: Tạo task
export const createTask = async (req, res) => {
    try {
        const { title, owner, status, priority, dueDate } = req.body;

        const user = await User.findById(req.user.userId)

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        // 1. Kiểm tra dữ liệu bắt buộc
        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                message: "Task title is required",
            });
        }


        // 2. Kiểm tra status
        if (
            status !== undefined &&
            !validStatuses.includes(status)
        ) {
            return res.status(400).json({
                message: "Invalid task status",
            });
        }

        // 3. Kiểm tra priority
        if (
            priority !== undefined &&
            !validPriorities.includes(priority)
        ) {
            return res.status(400).json({
                message: "Invalid task priority",
            });
        }

        // 4. Tạo task
        const task = await Task.create({
            title: title.trim(),
            owner: user.name,
            createdBy: req.user.userId,
            status,
            priority,
            dueDate: dueDate || undefined,
        });

        return res.status(201).json(task);
    } catch (error) {
        console.error("CREATE TASK ERROR:", error);

        if (
            error.name === "ValidationError" ||
            error.name === "CastError"
        ) {
            return res.status(400).json({
                message: "Invalid task data",
            });
        }

        return res.status(500).json({
            message: "Failed to create task",
        });
    }
};

// DELETE: Xóa task
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra ID trước khi truy vấn MongoDB
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid task ID",
            });
        }

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        if (
            req.user.role !== "Admin" &&
            (
                !task.createdBy ||
                task.createdBy.toString() !== req.user.userId
            )
        ) {
            return res.status(403).json({
                message: "You can only delete tasks created by yourself",
            });
        }

        await task.deleteOne();

        return res.status(200).json({
            message: "Task deleted successfully",
        });
    } catch (error) {
        console.error("DELETE TASK ERROR:", error);

        return res.status(500).json({
            message: "Failed to delete task",
        });
    }
};

// PUT: Cập nhật task
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, owner, status, priority, dueDate } = req.body;

        // 1. Kiểm tra ID
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid task ID",
            });
        }

        // 2. Kiểm tra title
        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                message: "Task title is required",
            });
        }

        // 3. Kiểm tra owner
        if (typeof owner !== "string" || !owner.trim()) {
            return res.status(400).json({
                message: "Task owner is required",
            });
        }

        // 4. Kiểm tra status
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid task status",
            });
        }

        // 5. Kiểm tra priority
        if (!validPriorities.includes(priority)) {
            return res.status(400).json({
                message: "Invalid task priority",
            });
        }

        // 6. Cập nhật task
        // const task = await Task.findByIdAndUpdate(
        //     id,
        //     {
        //         title: title.trim(),
        //         owner: owner.trim(),
        //         status,
        //         priority,
        //         dueDate: dueDate || null,
        //     },
        //     {
        //         new: true,
        //         runValidators: true,
        //     }
        // );

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            })
        }

        if (
            req.user.role !== "Admin" &&
            (
                !task.createdBy ||
                task.createdBy.toString() !== req.user.userId
            )
        ) {
            return res.status(403).json({
                message: "You can only update tasks created by yourself",
            });
        }
        task.title = title.trim();
        task.owner = owner.trim();
        task.status = status;
        task.priority = priority;
        task.dueDate = dueDate || null;

        await task.save();

        return res.status(200).json(task);
    } catch (error) {
        console.error("UPDATE TASK ERROR:", error);

        if (
            error.name === "ValidationError" ||
            error.name === "CastError"
        ) {
            return res.status(400).json({
                message: "Invalid task data",
            });
        }

        return res.status(500).json({
            message: "Failed to update task",
        });
    }
};