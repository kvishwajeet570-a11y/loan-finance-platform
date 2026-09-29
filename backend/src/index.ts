import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import routes from "./routes";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://192.168.1.5:3000",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Uploaded files
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

// API routes
app.use("/api", routes);

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Loan Finance Backend API is running",
    port: PORT,
  });
});

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`📁 Uploads: http://localhost:${PORT}/uploads`);
});
