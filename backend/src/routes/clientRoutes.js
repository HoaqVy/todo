
import express from "express";
import {
    getClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
} from "../controllers/clientController.js";

const router = express.Router();

// GET: Lấy danh sách Client
router.get("/", getClients);

// GET: Lấy một Client theo ID
router.get("/:id", getClientById);

// POST: Tạo Client mới
router.post("/", createClient);

// PUT: Cập nhật Client
router.put("/:id", updateClient);

// DELETE: Xóa Client
router.delete("/:id", deleteClient);

export default router;
