// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import connectDB from "./config/db.js";

// import taskRoutes from "./routes/taskRoutes.js";
// import teamMemberRoutes from "./routes/teamMemberRoutes.js"
// import teamRoutes from "./routes/teamRoutes.js";
// import clientRoutes from "./routes/clientRoutes.js";
// import authRoutes from "./routes/authRoutes.js"
// import noteRoutes from "./routes/noteRoutes.js";

// dotenv.config();
// const { verifyEmailConnection } = await import("./services/emailService.js");


// const app = express();

// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//     res.json({
//         message: "Todo API is running",
//     });
// });

// app.use(async (req, res, next) => {
//     try {
//         await connectDB();
//         next();
//     } catch (error) {
//         console.error("Database connection error:", error.message);

//         res.status(500).json({
//             message: "Database connection failed",
//         });
//     }
// });

// app.use("/api/tasks", taskRoutes);
// app.use("/api/team-members", teamMemberRoutes)
// app.use("/api/teams", teamRoutes)
// app.use("/api/clients", clientRoutes)
// app.use("/api/auth", authRoutes)
// app.use("/api/notes", noteRoutes);


// const PORT = process.env.PORT || 5000;

// // connectDB().then(async () => {
// //     app.listen(PORT, () => {
// //         console.log(`Server running on http://localhost:${PORT}`);
// //     });

// //     await verifyEmailConnection();
// // });


// if (process.env.NODE_ENV !== "production") {
//     const PORT = process.env.PORT || 5000;

//     app.listen(PORT, () => {
//         console.log(`Server running on http://localhost:${PORT}`);
//     });
//     await verifyEmailConnection();
// }


import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./config/db.js";

import taskRoutes from "./routes/taskRoutes.js";
import teamMemberRoutes from "./routes/teamMemberRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";


const { verifyEmailConnection } = await import("./services/emailService.js");

const app = express();

app.use(cors());
app.use(express.json());



// Connect MongoDB before handling API requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database connection error:", error.message);

        res.status(500).json({
            message: "Database connection failed",
        });
    }
});

// Health check
app.get("/", (req, res) => {
    res.json({
        message: "Todo API is running",
    });
});

// API routes
app.use("/api/tasks", taskRoutes);
app.use("/api/team-members", teamMemberRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// Start local server only
// if (process.env.NODE_ENV !== "production") {
//     const PORT = process.env.PORT || 5000;

//     app.listen(PORT, async () => {
//         console.log(`Server running on http://localhost:${PORT}`);

//         try {
//             const { default: transporter } = await import(
//                 "./services/emailService.js"
//             );

//             await transporter.verify();
//             console.log("Gmail SMTP connection successful!");
//         } catch (error) {
//             console.error("Gmail SMTP connection failed:", error.message);
//         }
//     });
// }

if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
    await verifyEmailConnection();
}

export default app;
