
import Client from "../models/Client.js";
import Team from "../models/Team.js";

// Kiểm tra Team được gán cho Client
const validateTeam = async (teamId) => {
    if (teamId === undefined || teamId === null || teamId === "") {
        return null;
    }

    const team = await Team.findById(teamId);

    if (!team) {
        const error = new Error("Team not found.");
        error.statusCode = 404;
        throw error;
    }

    return team._id;
};

// GET: Lấy danh sách Client
export const getClients = async (req, res) => {
    try {
        const clients = await Client.find()
            .populate("teamId", "name status")
            .sort({ createdAt: -1 });

        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch clients.",
        });
    }
};

// GET: Lấy một Client theo ID
export const getClientById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id)
            .populate("teamId", "name status");

        if (!client) {
            return res.status(404).json({
                message: "Client not found.",
            });
        }

        res.status(200).json(client);
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid client ID.",
            });
        }

        res.status(500).json({
            message: "Failed to fetch client.",
        });
    }
};

// POST: Tạo Client mới
export const createClient = async (req, res) => {
    try {
        const { name, company, email, phone, status, teamId } = req.body;

        const validTeamId = await validateTeam(teamId);

        const client = await Client.create({
            name,
            company,
            email,
            phone,
            status,
            teamId: validTeamId,
        });

        res.status(201).json(client);
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
            return res.status(400).json({
                message: "Invalid Team ID.",
            });
        }

        res.status(500).json({
            message: "Failed to create client.",
        });
    }
};

// PUT: Cập nhật Client
export const updateClient = async (req, res) => {
    try {
        const { name, company, email, phone, status, teamId } = req.body;

        const updateData = {
            name,
            company,
            email,
            phone,
            status,
        };

        // Chỉ cập nhật teamId khi request có gửi trường này
        if (Object.hasOwn(req.body, "teamId")) {
            updateData.teamId = await validateTeam(teamId);
        }

        const client = await Client.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                runValidators: true,
                returnDocument: "after",
            }
        );

        if (!client) {
            return res.status(404).json({
                message: "Client not found.",
            });
        }

        res.status(200).json(client);
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
            return res.status(400).json({
                message: "Invalid ID.",
            });
        }

        res.status(500).json({
            message: "Failed to update client.",
        });
    }
};

// DELETE: Xóa Client
export const deleteClient = async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);

        if (!client) {
            return res.status(404).json({
                message: "Client not found.",
            });
        }

        res.status(200).json({
            message: "Client deleted successfully.",
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid client ID.",
            });
        }

        res.status(500).json({
            message: "Failed to delete client.",
        });
    }
};
