
import TeamMember from "../models/TeamMember.js";

// GET: Lấy danh sách thành viên
export const getTeamMembers = async (req, res) => {
    try {
        const members = await TeamMember.find().sort({ createdAt: -1 });

        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch team members.",
        });
    }
};

// POST: Thêm thành viên
export const createTeamMember = async (req, res) => {
    try {
        const { name, email, position, role, status } = req.body;

        const member = await TeamMember.create({
            name,
            email,
            position,
            role,
            status
        });

        res.status(201).json(member);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "This email already exists.",
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message,
            });
        }

        res.status(500).json({
            message: "Failed to create team member.",
        });
    }
};

// PUT: Cập nhật thành viên
export const updateTeamMember = async (req, res) => {
    try {
        const { name, email, position, role, status } = req.body;

        const member = await TeamMember.findByIdAndUpdate(
            req.params.id,
            { name, email, position, role, status },
            {
                runValidators: true,
                returnDocument: "after"
            }
        );

        if (!member) {
            return res.status(404).json({
                message: "Team member not found.",
            });
        }

        res.status(200).json(member);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "This email already exists.",
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message,
            });
        }

        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid team member ID.",
            });
        }

        res.status(500).json({
            message: "Failed to update team member.",
        });
    }
};

// DELETE: Xóa thành viên
export const deleteTeamMember = async (req, res) => {
    try {
        const member = await TeamMember.findByIdAndDelete(req.params.id);

        if (!member) {
            return res.status(404).json({
                message: "Team member not found.",
            });
        }

        res.status(200).json({
            message: "Team member deleted successfully.",
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid team member ID.",
            });
        }

        res.status(500).json({
            message: "Failed to delete team member.",
        });
    }
};
