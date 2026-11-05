
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
    let session;

    try {
        // 1. Bắt đầu MongoDB Transaction
        session = await mongoose.startSession();
        session.startTransaction();

        // 2. Tìm TeamMember cần cập nhật
        const member = await TeamMember.findById(req.params.id).session(session);

        if (!member) {
            await session.abortTransaction();

            return res.status(404).json({
                message: "Team member not found."
            });
        }

        // 3. Tìm User tương ứng bằng email hiện tại
        const user = await User.findOne({
            email: member.email
        }).session(session);

        if (!user) {
            await session.abortTransaction();

            return res.status(404).json({
                message: "User account associated with this team member was not found."
            });
        }

        // 4. Lấy dữ liệu cập nhật
        const { name, email, position, role, status, teamId } = req.body;

        // 5. Chuẩn hóa email mới nếu request có gửi email
        const normalizedEmail = Object.hasOwn(req.body, "email")
            ? email?.trim().toLowerCase()
            : member.email;

        // 6. Kiểm tra email hợp lệ
        if (!normalizedEmail) {
            await session.abortTransaction();

            return res.status(400).json({
                message: "Email is required."
            });
        }

        // 7. Kiểm tra email mới có thuộc User khác không
        const existingUser = await User.findOne({
            email: normalizedEmail,
            _id: { $ne: user._id }
        }).session(session);

        if (existingUser) {
            await session.abortTransaction();

            return res.status(409).json({
                message: "This email already belongs to another user."
            });
        }

        // 8. Kiểm tra email mới có thuộc TeamMember khác không
        const existingMember = await TeamMember.findOne({
            email: normalizedEmail,
            _id: { $ne: member._id }
        }).session(session);

        if (existingMember) {
            await session.abortTransaction();

            return res.status(409).json({
                message: "This email already belongs to another team member."
            });
        }

        // 9. Cập nhật tên và email cho User
        if (Object.hasOwn(req.body, "name")) {
            user.name = name;
        }

        user.email = normalizedEmail;

        // 10. Cập nhật tên và email cho TeamMember
        if (Object.hasOwn(req.body, "name")) {
            member.name = name;
        }

        member.email = normalizedEmail;

        // 11. Cập nhật các thông tin riêng của TeamMember
        if (Object.hasOwn(req.body, "position")) {
            member.position = position;
        }

        if (Object.hasOwn(req.body, "role")) {
            member.role = role;
        }

        if (Object.hasOwn(req.body, "status")) {
            member.status = status;
        }

        if (Object.hasOwn(req.body, "teamId")) {
            member.teamId = await validateTeam(teamId);
        }

        // 12. Lưu cả hai document trong cùng Transaction
        await user.save({ session });
        await member.save({ session });

        // 13. Hoàn tất Transaction
        await session.commitTransaction();

        // 14. Trả về TeamMember đã cập nhật
        return res.status(200).json(member);

    } catch (error) {
        // 15. Rollback nếu Transaction chưa hoàn tất
        if (session?.inTransaction()) {
            await session.abortTransaction();
        }

        // 16. Xử lý lỗi email trùng
        if (error.code === 11000) {
            return res.status(409).json({
                message: "This email already exists."
            });
        }

        // 17. Xử lý lỗi từ validateTeam
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        // 18. Xử lý lỗi validation của Mongoose
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }

        // 19. Xử lý ID không hợp lệ
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid ID.",
                field: error.path,
                value: error.value
            });
        }

        console.error("Update TeamMember error:", error);

        return res.status(500).json({
            message: "Failed to update team member."
        });
    } finally {
        if (session) {
            await session.endSession();
        }
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
