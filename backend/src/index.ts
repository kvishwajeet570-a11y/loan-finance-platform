import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth/auth.route";
import loanRoutes from "./routes/loan/loan.route";

const app = express();

/* ========================================
   MIDDLEWARE
======================================== */

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/* ========================================
   API ROUTES
======================================== */

app.use("/api/auth", authRoutes);

app.use("/api/loan", loanRoutes);

/* ========================================
   ROOT ROUTE
======================================== */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Loan Finance Backend Running Successfully",
  });
});

/* ========================================
   HEALTH CHECK
======================================== */

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

/* ========================================
   SERVER
======================================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;