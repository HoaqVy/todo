import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";
import teamMemberRoutes from "./routes/teamMemberRoutes.js"
import teamRoutes from "./routes/teamRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import authRoutes from "./routes/authRoutes.js"
import noteRoutes from "./routes/noteRoutes.js";
// import { verifyEmailConnection } from "./services/emailService.js";

dotenv.config();
const { verifyEmailConnection } = await import("./services/emailService.js");

console.log("SMTP_USER loaded:", Boolean(process.env.SMTP_USER));
console.log("SMTP_PASS loaded:", Boolean(process.env.SMTP_PASS));

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Todo API is running",
    });
});


app.use("/api/tasks", taskRoutes);
app.use("/api/team-members", teamMemberRoutes)
app.use("/api/teams", teamRoutes)
app.use("/api/clients", clientRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/notes", noteRoutes);


const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });

    await verifyEmailConnection();
});