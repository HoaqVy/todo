import Task from "../models/Task.js";

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch tasks",
            error: error.message,
        });
    }
};

export const createTask = async (req, res) => {
    try {
        const {
            title,
            owner,
            status,
            priority,
            dueDate,
        } = req.body;

        const task = await Task.create({
            title,
            owner,
            status,
            priority,
            dueDate,
        });

        res.status(201).json(task);
    } catch (error) {
        console.error("CREATE TASK ERROR:", error);

        res.status(500).json({
            message: "Failed to create task",
            error: error.message,
        });
    }
}