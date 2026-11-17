import Team from "../models/Team.js";
import Client from "../models/Client.js";
import TeamMember from "../models/TeamMember.js"
import Note from "../models/Note.js";
import mongoose from "mongoose";


// GET: Lấy danh sách Team
export const getTeams = async (req, res) => {
    try {
        const teams = await Team.find().sort({ createdAt: -1 });

        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch teams",
        });
    }
};

// GET: Lấy một Team theo ID
export const getTeamById = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                message: "Team not found",
            });
        }

        res.status(200).json(team);
    } catch (error) {
        res.status(400).json({
            message: "Invalid team ID",
        });
    }
};

// POST: Tạo Team mới
export const createTeam = async (req, res) => {
    try {
        const { name, description, status } = req.body;

        const team = await Team.create({
            name,
            description,
            status,
        });

        res.status(201).json(team);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Team name already exists",
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message,
            });
        }

        res.status(500).json({
            message: "Failed to create team",
        });
    }
};

// PUT: Cập nhật Team
export const updateTeam = async (req, res) => {
    try {
        const { name, description, status } = req.body;

        const team = await Team.findByIdAndUpdate(
            req.params.id,
            { name, description, status },
            {
                returnDocument: "after",
                runValidators: true,
            }
        );

        if (!team) {
            return res.status(404).json({
                message: "Team not found",
            });
        }

        res.status(200).json(team);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Team name already exists",
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message,
            });
        }

        res.status(400).json({
            message: "Failed to update team",
        });
    }
};

// DELETE: Giải thể Team
export const deleteTeam = async (req, res) => {
    let session;

    try {
        // 1. Start Transaction
        session = await mongoose.startSession();
        session.startTransaction();

        // 2. Find Team
        const team = await Team.findById(req.params.id).session(session);

        if (!team) {
            await session.abortTransaction();

            return res.status(404).json({
                message: "Team not found.",
            });
        }

        // 3. Delete all Team Members
        await TeamMember.deleteMany({
            teamId: team._id,
        }, { session });

        // 4. Keep Clients but remove Team assignment
        await Client.updateMany(
            { teamId: team._id },
            { $set: { teamId: null } },
            { session }
        );

        // 5. Delete Team Notes only
        await Note.deleteMany({
            type: "Team",
            teamId: team._id,
        }, { session });

        // 6. Delete Team
        await Team.deleteOne({
            _id: team._id,
        }, { session });

        // 7. Commit Transaction
        await session.commitTransaction();

        return res.status(200).json({
            message: "Team deleted successfully.",
        });

    } catch (error) {
        // Rollback if something fails
        if (session?.inTransaction()) {
            await session.abortTransaction();
        }

        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid team ID.",
            });
        }

        console.error("DELETE TEAM ERROR:", error);

        return res.status(500).json({
            message: "Failed to delete team.",
        });

    } finally {
        if (session) {
            await session.endSession();
        }
    }
};