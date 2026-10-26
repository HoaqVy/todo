import express from "express";
import { createTeam, deleteTeam, getTeamById, getTeams, updateTeam } from "../controllers/teamController.js";


const router = express.Router()

// GET: lấy danh sách Team
router.get("/", getTeams)

// GET: Lấy chi tiết 1 team
router.get("/:id", getTeamById)

// POST: Tạo team
router.post("/", createTeam)

// PUT: Cập nhật team
router.put("/:id", updateTeam)

// DELETE: xóa team
router.delete("/:id", deleteTeam)

export default router