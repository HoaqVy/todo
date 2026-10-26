import Team from "../models/Team.js";

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

// DELETE: Xóa Team
export const deleteTeam = async (req, res) => {
    try {
        const team = await Team.findByIdAndDelete(req.params.id);

        if (!team) {
            return res.status(404).json({
                message: "Team not found",
            });
        }

        res.status(200).json({
            message: "Team deleted successfully",
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to delete team",
        });
    }
};