import User from "../models/User.js";
import TeamMember from "../models/TeamMember.js";
import Note from "../models/Note.js";

// Find the TeamMember profile of the logged-in user
const getUserTeam = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        return null;
    }

    const teamMember = await TeamMember.findOne({
        email: user.email,
        status: "Active"
    });

    return teamMember;
};

export const getNotes = async (req, res) => {
    try {
        // 1. Tìm TeamMember của User đang đăng nhập
        const teamMember = await getUserTeam(req.user.userId);

        // 2. Tạo điều kiện lấy Personal Notes của chính User
        const noteFilter = [
            {
                type: "Personal",
                createdBy: req.user.userId
            }
        ];

        // 3. Nếu User thuộc một Team,
        // chỉ lấy Team Notes của Team đó
        if (teamMember?.teamId) {
            noteFilter.push({
                type: "Team",
                teamId: teamMember.teamId
            });
        }

        // 4. Lấy Notes
        const notes = await Note.find({
            $or: noteFilter
        })
            .populate("createdBy", "name email")
            .populate("teamId", "name")
            .sort({
                isPinned: -1,
                createdAt: -1
            });

        return res.status(200).json(notes);

    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch notes",
            error: error.message
        });
    }
};

// Create a new note
export const createNote = async (req, res) => {
    try {
        const {
            title,
            content,
            type,
            teamId,
            color,
            isPinned
        } = req.body;

        if (!title?.trim() || !content?.trim()) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        let noteTeamId = null;

        if (type === "Team") {
            const teamMember = await getUserTeam(req.user.userId);

            if (!teamMember || !teamMember.teamId) {
                return res.status(403).json({
                    message: "You are not assigned to a team"
                });
            }

            noteTeamId = teamMember.teamId;
        } else if (type !== "Personal" && type !== undefined) {
            return res.status(400).json({
                message: "Invalid note type"
            });
        }

        const note = await Note.create({
            title: title.trim(),
            content: content.trim(),
            createdBy: req.user.userId,
            type: type || "Personal",
            teamId: noteTeamId,
            color,
            isPinned
        });

        return res.status(201).json({
            message: "Note created successfully",
            note
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create note",
            error: error.message
        });
    }
};

// Update a note
export const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, color, isPinned } = req.body;

        const note = await Note.findById(id);

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        // Check permission
        const isOwner =
            note.createdBy.toString() === req.user.userId;

        let canUpdate = false;

        if (note.type === "Personal") {
            canUpdate = isOwner;
        } else if (note.type === "Team") {
            const teamMember = await getUserTeam(req.user.userId);

            const isSameTeam =
                teamMember?.teamId &&
                teamMember.teamId.toString() === note.teamId?.toString();

            const isTeamAdmin = teamMember?.role === "Admin";

            canUpdate =
                isSameTeam && (isOwner || isTeamAdmin);
        }

        if (!canUpdate) {
            return res.status(403).json({
                message: "You do not have permission to update this note"
            });
        }

        // Validate content
        if (!title?.trim() || !content?.trim()) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        note.title = title.trim();
        note.content = content.trim();

        if (color !== undefined) {
            note.color = color;
        }

        if (isPinned !== undefined) {
            note.isPinned = isPinned;
        }

        await note.save();

        return res.status(200).json({
            message: "Note updated successfully",
            note
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update note",
            error: error.message
        });
    }
};

// Delete a note
export const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;

        const note = await Note.findById(id);

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        // Check permission
        const isOwner =
            note.createdBy.toString() === req.user.userId;

        let canDelete = false;

        if (note.type === "Personal") {
            canDelete = isOwner;
        } else if (note.type === "Team") {
            const teamMember = await getUserTeam(req.user.userId);

            const isSameTeam =
                teamMember?.teamId &&
                teamMember.teamId.toString() === note.teamId?.toString();

            const isTeamAdmin = teamMember?.role === "Admin";

            canDelete =
                isSameTeam && (isOwner || isTeamAdmin);
        }

        if (!canDelete) {
            return res.status(403).json({
                message: "You do not have permission to delete this note"
            });
        }

        await Note.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Note deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete note",
            error: error.message
        });
    }
};