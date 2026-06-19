import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import loanRoutes from "./routes/loanRoutes";
import walletRoutes from "./routes/walletRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import rechargeRoutes from "./routes/rechargeRoutes";
import referralRoutes from "./routes/referralRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import leaderboardRoutes from "./routes/leaderboardRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import profileRoutes from "./routes/profileRoutes";
import revenueRoutes from "./routes/revenueRoutes";
import supportRoutes from "./routes/supportRoutes";
import taskRoutes from "./routes/taskRoutes";
import adminRoutes from "./routes/adminRoutes";
import achievementRoutes from "./routes/achievementRoutes";
import commissionRoutes from "./routes/commissionRoutes";
import contactRoutes from "./routes/contactRoutes";
import couponRoutes from "./routes/couponRoutes";
import jobRoutes from "./routes/jobRoutes";

const app = express();


/* ========================================
   MIDDLEWARE
======================================== */

app.use(
  cors({
    origin: "*",
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
    ],
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

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/loan",
  loanRoutes
);

app.use(
  "/api/wallet",
  walletRoutes
);

app.use(
  "/api/transaction",
  transactionRoutes
);

app.use(
  "/api/recharge",
  rechargeRoutes
);

app.use(
  "/api/referral",
  referralRoutes
);

app.use(
  "/api/analytics",
  analyticsRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/leaderboard",
  leaderboardRoutes
);

app.use(
  "/api/notification",
  notificationRoutes
);

app.use(
  "/api/profile",
  profileRoutes
);

app.use(
  "/api/revenue",
  revenueRoutes
);

app.use(
  "/api/support",
  supportRoutes
);

app.use(
  "/api/task",
  taskRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/achievement",
  achievementRoutes
);

app.use(
  "/api/commission",
  commissionRoutes
);

app.use(
  "/api/contact",
  contactRoutes
);

app.use(
  "/api/coupon",
  couponRoutes
);

app.use(
  "/api/job",
  jobRoutes
);


/* ========================================
   ROOT ROUTE
======================================== */

app.get("/", (req, res) => {

  res.status(200).json({

    success: true,

    message:
      "Loan Finance Backend Running Successfully",

  });

});


/* ========================================
   SERVER HEALTH CHECK
======================================== */

app.get(
  "/health",
  (req, res) => {

    res.status(200).json({

      success: true,

      message:
        "Server is healthy",

    });

  }
);


/* ========================================
   SERVER
======================================== */

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});


export default app;