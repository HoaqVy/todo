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

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params
        const task = await Task.findByIdAndDelete(id)

        if (!task) {
            return res.status(400).json({
                message: "Task not found"
            })
        }
        res.status(200).json({
            message: "Task deleted successfully"
        })
    } catch (error) {
        console.error("DELETE TASK ERROR: ", error)
        res.status(500).json({
            message: "Failed to delete task",
            error: error.message
        })
    }
}

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params

        const {
            title,
            owner,
            status,
            priority,
            dueDate
        } = req.body
        const task = await Task.findByIdAndUpdate(
            id,
            {
                title, owner, status, priority, dueDate
            },
            {
                returnDocument: "after",
                runValidators: true,
            }
        )

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            })
        }
        res.status(200).json(task)
    } catch (error) {
        console.error("UPDATE TASK ERROR:", error);

        res.status(500).json({
            message: "Failed to update task",
            error: error.message
        })

    }
}