
import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
        },
        position: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            enum: ["Admin", "Member"],
            default: "Member",
        },
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        }
    },
    {
        timestamps: true,
    }
);

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);

export default TeamMember;
