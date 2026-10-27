import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true

        },
        company: {
            type: String,
            trim: true,
            default: ""
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        phone: {
            type: String,
            trim: true,
            default: ""
        },
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        },
        teamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            default: null
        },
    },
    {
        timestamps: true
    }
)

const Client = mongoose.model("Client", clientSchema)

export default Client