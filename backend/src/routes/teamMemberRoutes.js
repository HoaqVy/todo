
import express from "express";

import {
    getTeamMembers,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
} from "../controllers/teamMemberController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRole from "../middleware/authorizeRole.js";

const router = express.Router();
router.use(authMiddleware);
router.use(authorizeRole("Admin"));

router.get("/", getTeamMembers);
router.post("/", createTeamMember);
router.put("/:id", updateTeamMember);
router.delete("/:id", deleteTeamMember);

export default router;
