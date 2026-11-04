
import mongoose from "mongoose";
import Team from "../models/Team.js";
import TeamMember from "../models/TeamMember.js";
import User from "../models/User.js";

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
    let session;

    try {
        const {
            name,
            email,
            password,
            position,
            role,
            status,
            teamId
        } = req.body;

        // 1. Kiểm tra Email
        if (!email || typeof email !== "string" || !email.trim()) {
            return res.status(400).json({
                message: "Email is required."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // 2. Kiểm tra User đã tồn tại chưa
        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        // 3. Kiểm tra Team ID
        const validTeamId = await validateTeam(teamId);

        // 4. Kiểm tra TeamMember đã tồn tại chưa
        const existingMember = await TeamMember.findOne({
            email: normalizedEmail
        });

        if (existingMember) {
            // Member đã thuộc một Team
            if (existingMember.teamId) {
                if (
                    validTeamId &&
                    existingMember.teamId.toString() !== validTeamId.toString()
                ) {
                    return res.status(409).json({
                        message: "This user already belongs to another team."
                    });
                }

                return res.status(409).json({
                    message: "This user is already a member of this team."
                });
            }

            // Member đã có profile nhưng chưa được gán Team
            return res.status(409).json({
                message: "This email already has a team member profile."
            });
        }

        // 5. Nếu User chưa tồn tại thì bắt buộc phải có Password
        if (!existingUser && (!password || password.length < 6)) {
            return res.status(400).json({
                message: "Password must be at least 6 characters."
            });
        }

        // 6. Bắt đầu MongoDB Transaction
        session = await mongoose.startSession();
        session.startTransaction();

        // 7. Nếu chưa có User thì tạo tài khoản mới
        if (!existingUser) {
            await User.create([{
                name,
                email: normalizedEmail,
                password,
                role: "Member",
                mustChangePassword: true
            }], { session });
        }

        // 8. Tạo TeamMember
        const [member] = await TeamMember.create([{
            name,
            email: normalizedEmail,
            position,
            role,
            status,
            teamId: validTeamId
        }], { session });

        // 9. Hoàn tất Transaction
        await session.commitTransaction();

        return res.status(201).json(member);

    } catch (error) {
        // Rollback nếu Transaction chưa hoàn tất
        if (session?.inTransaction()) {
            await session.abortTransaction();
        }

        if (error.code === 11000) {
            return res.status(409).json({
                message: "This email already exists."
            });
        }

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }

        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid Team ID"
            });
        }

        return res.status(500).json({
            message: "Failed to create team member."
        });

    } finally {
        if (session) {
            await session.endSession();
        }
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
