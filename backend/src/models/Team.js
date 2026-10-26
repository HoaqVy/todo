import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        description: {
            type: String,
            trim: true,
            default: "",

        },
        default: {
            type: String,
            trim: true,
            default: ""
        },
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        }
    },
    {
        timeseries: true
    }
)

const Team = mongoose.model("Team", teamSchema)

export default Team