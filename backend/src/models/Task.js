import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        owner: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: ["Todo", "In Progress", "Completed"],
            default: "Todo"
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium"
        },
        dueDate: {
            type: Date
        },
    },
    {
        timestamps: true
    }
)

const Task = mongoose.model("Task", taskSchema)

export default Task