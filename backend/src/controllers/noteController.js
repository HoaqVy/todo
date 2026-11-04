import User from "../models/User.js";
import TeamMember from "../models/TeamMember.js";
import Note from "../models/Note.js";
import Team from "../models/Team.js";

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

// Get all notes
export const getNotes = async (req, res) => {
    try {
        let notes;

        if (req.user.role === "Admin") {
            notes = await Note.find({
                $or: [
                    {
                        type: "Personal",
                        createdBy: req.user.userId
                    },
                    {
                        type: "Team"
                    }
                ]
            })
                .populate("createdBy", "name email")
                .populate("teamId", "name")
                .sort({ isPinned: -1, createdAt: -1 });
        } else {
            const teamMember = await getUserTeam(req.user.userId);

            const teamId = teamMember?.teamId || null;

            const noteFilter = [
                {
                    type: "Personal",
                    createdBy: req.user.userId
                }
            ];

            if (teamId) {
                noteFilter.push({
                    type: "Team",
                    teamId: teamId
                });
            }

            notes = await Note.find({
                $or: noteFilter
            })
                .populate("createdBy", "name email")
                .populate("teamId", "name")
                .sort({ isPinned: -1, createdAt: -1 });
        }

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
            if (req.user.role !== "Admin") {
                const teamMember = await getUserTeam(req.user.userId);

                if (!teamMember || !teamMember.teamId) {
                    return res.status(403).json({
                        message: "You are not assigned to a team"
                    });
                }

                noteTeamId = teamMember.teamId;
            } else {
                if (!teamId) {
                    return res.status(400).json({
                        message: "Team ID is required"
                    });
                }

                const team = await Team.findById(teamId);

                if (!team) {
                    return res.status(404).json({
                        message: "Team not found"
                    });
                }

                noteTeamId = team._id;
            }
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

        const isAdmin = req.user.role === "Admin";

        const canUpdate =
            note.type === "Team"
                ? isAdmin || isOwner
                : isOwner;

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
        // Check permission
        const isOwner =
            note.createdBy.toString() === req.user.userId;

        const isAdmin = req.user.role === "Admin";

        const canDelete =
            note.type === "Team"
                ? isAdmin || isOwner
                : isOwner;

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