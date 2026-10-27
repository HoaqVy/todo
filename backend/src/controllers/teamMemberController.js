
import Team from "../models/Team.js";
import TeamMember from "../models/TeamMember.js";

const validateTeam = async (teamId) => {
    if (teamId === undefined || teamId === null || teamId === "") {
        return null
    }

    const team = await Team.findById(teamId)

    if (!team) {
        const error = new Error("Team not found")
        error.statusCode = 404
        throw error
    }
    return team._id
}

// GET: Lấy danh sách thành viên
export const getTeamMembers = async (req, res) => {
    try {
        const members = await TeamMember.find()
            .populate("teamId", "name status")
            .sort({ createdAt: -1 });

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
        const { name, email, position, role, status, teamId } = req.body;

        const validTeamId = await validateTeam(teamId)

        const member = await TeamMember.create({
            name,
            email,
            position,
            role,
            status,
            teamId: validTeamId
        });

        res.status(201).json(member);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "This email already exists.",
            });
        }

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            })
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message,
            });
        }

        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid Team ID"
            })
        }

        res.status(500).json({
            message: "Failed to create team member.",
        });
    }
};

// PUT: Cập nhật thành viên

export const updateTeamMember = async (req, res) => {
    try {
        const { name, email, position, role, status, teamId } = req.body;

        const updateData = {
            name,
            email,
            position,
            role,
            status,
        };

        // Chỉ cập nhật teamId khi request thực sự gửi trường này
        if (Object.hasOwn(req.body, "teamId")) {
            updateData.teamId = await validateTeam(teamId);
        }

        const member = await TeamMember.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                runValidators: true,
                returnDocument: "after",
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

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message,
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message,
            });
        }

        if (error.name === "CastError") {
            console.error("CastError details:", error);

            return res.status(400).json({
                message: "Invalid ID.",
                field: error.path,
                value: error.value,
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
