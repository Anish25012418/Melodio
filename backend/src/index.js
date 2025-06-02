import express from "express";
import dotenv from "dotenv";
import {clerkMiddleware} from "@clerk/express";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import songRoutes from "./routes/songRoutes.js";
import albumRoutes from "./routes/albumRoutes.js";
import statRoutes from "./routes/statRoutes.js";
import {connectDB} from "./lib/db.js";
import fileUpload from "express-fileupload"
import path from "node:path";
import cors from "cors";
import { createServer } from "node:http";
import {initializeSocket} from "./lib/socket.js";
import cron from "node-cron";
import fs from "node:fs";


dotenv.config();

const app = express();
const __dirname = path.resolve()
const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);
initializeSocket(httpServer);

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json()); //to parse req.body

app.use(clerkMiddleware()); // this will add auth to req obj => req.auth
app.use(fileUpload({
  useTempFiles: true, tempFilePath: path.join(__dirname, "temp"), createParentPath: true, limits: {
    fileSize: 10 * 1024 * 1024,
  }
}))

const tempDir = path.join(process.cwd(), "tmp");
//corn jobs
cron.schedule("0 * * * *", async () => {
  if (fs.existsSync(tempDir)) {
    fs.readdir(tempDir, (err, files) => {
      if (err) {
        console.error("error", err);
        return;
      }
      for (const file of files) {
        fs.unlink(path.join(tempDir, file), err => {})
      }
    })
  }
})

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);

if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  })
}

//error handler
app.use((err, req, res, next) => {
  res.status(500).json({message: process.env.NODE_ENV === "production" ? "Internal Server Error." : err.message});
})

httpServer.listen(PORT, () => {
  console.log("Server running on port " + PORT);
  connectDB();
});